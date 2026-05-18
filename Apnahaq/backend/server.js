import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjansahayakkey';

app.use(cors());
app.use(helmet());
app.use(express.json());

// --- MIDDLEWARES ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTHENTICATION ROUTES ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { password, ...userData } = req.body;
    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { aadhaarNumber: userData.aadhaarNumber }]
      }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User with this email or Aadhaar already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword
      }
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '24h' });
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({ message: 'Registration successful', token, user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    const { password: _, ...userWithoutPassword } = user;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const { password, ...userProfile } = user;
    res.json(userProfile);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { id, role, password, createdAt, updatedAt, subscriptions, ...updateData } = req.body;
    
    if (updateData.age) updateData.age = parseInt(updateData.age);
    if (updateData.annualIncome) updateData.annualIncome = parseFloat(updateData.annualIncome);
    if (updateData.educationMarks !== undefined) {
       updateData.educationMarks = updateData.educationMarks === '' ? null : parseFloat(updateData.educationMarks);
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: updateData
    });
    
    const { password: _, ...userProfile } = updatedUser;
    res.json({ message: 'Profile updated successfully', user: userProfile });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SUBSCRIPTION ROUTE (DUMMY PAYMENT) ---
app.post('/api/subscription/subscribe', authenticateToken, async (req, res) => {
  try {
    const { password, plan } = req.body;
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid verification credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid verification credentials' });
    }
    
    // Create subscription
    const amount = plan === 'Yearly' ? 999 : 99;
    const endDate = new Date();
    if (plan === 'Yearly') endDate.setFullYear(endDate.getFullYear() + 1);
    else endDate.setMonth(endDate.getMonth() + 1);

    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan,
        amount,
        status: 'ACTIVE',
        endDate
      }
    });

    // Update user status
    await prisma.user.update({
      where: { id: user.id },
      data: { isSubscribed: true }
    });

    res.json({ message: 'Payment successful. Subscription activated.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- SCHEME AND ELIGIBILITY ROUTES ---
app.get('/api/schemes', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.isSubscribed) {
      return res.status(403).json({ error: 'Subscription required to view schemes' });
    }
    
    const schemes = await prisma.scheme.findMany();
    res.json(schemes);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/schemes/eligible', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.isSubscribed) {
      return res.status(403).json({ error: 'Subscription required' });
    }

    const schemes = await prisma.scheme.findMany();
    const results = {
      eligible: [],
      partial: [],
      notEligible: []
    };

    schemes.forEach(scheme => {
      let score = 0;
      let totalCriteria = 0;
      let isStrictlyIneligible = false;

      if (scheme.minAge !== null) { totalCriteria++; if (user.age >= scheme.minAge) score++; else isStrictlyIneligible = true; }
      if (scheme.maxAge !== null) { totalCriteria++; if (user.age <= scheme.maxAge) score++; else isStrictlyIneligible = true; }
      if (scheme.maxIncome !== null) { totalCriteria++; if (user.annualIncome <= scheme.maxIncome) score++; else isStrictlyIneligible = true; }
      
      if (scheme.targetGender && scheme.targetGender !== 'Any') {
        totalCriteria++;
        if (user.gender.toLowerCase() === scheme.targetGender.toLowerCase()) score++; else isStrictlyIneligible = true;
      }
      
      if (scheme.targetCastes && scheme.targetCastes.length > 0 && !scheme.targetCastes.includes('Any')) {
        totalCriteria++;
        if (scheme.targetCastes.includes(user.casteCategory)) score++;
      }

      if (scheme.requiresStudent !== null) {
        totalCriteria++;
        if (user.isStudent === scheme.requiresStudent) score++;
      }
      
      if (scheme.requiresFarmer !== null) {
        totalCriteria++;
        if (user.isFarmer === scheme.requiresFarmer) score++;
      }

      if (scheme.requiresDisability !== null) {
        totalCriteria++;
        if (user.isDisabled === scheme.requiresDisability) score++;
      }

      const matchPercentage = totalCriteria === 0 ? 100 : Math.round((score / totalCriteria) * 100);

      const schemeResult = { ...scheme, matchPercentage };

      if (matchPercentage === 100 && !isStrictlyIneligible) {
        results.eligible.push(schemeResult);
      } else if (matchPercentage > 40 && !isStrictlyIneligible) {
        results.partial.push(schemeResult);
      } else {
        results.notEligible.push(schemeResult);
      }
    });

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/schemes/:id', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user.isSubscribed) {
      return res.status(403).json({ error: 'Subscription required' });
    }
    
    const scheme = await prisma.scheme.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    
    res.json(scheme);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
