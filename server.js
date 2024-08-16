const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const Developer = require('./models/Developer'); 
const Property = require('./models/Property'); 
const Detail = require('./models/Detail'); 
const User = require('./models/User'); 
const Test = require('./models/Test'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', // Change this to a more secure secret
  resave: false,
  saveUninitialized: true,
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Admin access middleware
const isAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'views', 'verify-code.html'));
};

// Route to display properties
app.get('/', async (req, res) => {
  try {
    const selectedCategories = req.query.categories ? req.query.categories.split(',') : [];
    let propertyFilter = {};

    if (selectedCategories.length > 0) {
      propertyFilter.categories = { $in: selectedCategories };
    }

    const allProperties = await Property.find(propertyFilter);
    const allDevelopers = await Developer.find(); // Fetch developers
    const allDetails = await Detail.find(); // Fetch details
    const allTests = await Test.find(); // Fetch details

    const categorizedProperties = {
      hero: allProperties.filter(p => p.categories.includes('Hero')),
      spotlight: allProperties.filter(p => p.categories.includes('Spotlight')),
      luxuryRedefined: allProperties.filter(p => p.categories.includes('Luxury Redefined')),
      accessibleProject: allProperties.filter(p => p.categories.includes('Accessible Project')),
      trendingResidences: allProperties.filter(p => p.categories.includes('Trending Residences')),
      signatureDevelopments: allProperties.filter(p => p.categories.includes('SIGNATURE Developments')),
      residentialProjects: allProperties.filter(p => p.categories.includes('Residential Projects')),
      commercialProjects: allProperties.filter(p => p.categories.includes('Commercial Projects')),
    };

    res.render('index', { 
      properties: categorizedProperties,
      developers: allDevelopers,
      details: allDetails,
      tests: allTests,
      isAdmin: req.session.isAdmin
    });
  } catch (err) {
    console.error('Error fetching data:', err); // Log error details
    res.status(500).send('Server Error');
  }
});




// Route to display add property form (restricted to admin)
app.get('/add', isAdmin, (req, res) => {
  res.render('add');
});

app.get('/devdetails', isAdmin, (req, res) => {
  res.render('details');
});

app.get('/addDev', (req, res) => {
  res.render('addDeveloper', { developer: {} }); // Pass an empty object or provide default values
});

app.get('/addTest', (req, res) => {
  res.render('test'); // Pass an empty object or provide default values
});

// Handle adding new property
app.post('/add', isAdmin, async (req, res) => {
  try {
    const {
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession,
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories, // Should be an array of strings
      imageUrl,
      dis1,
      dis2,
      dis3,
      dis4,
      dis5,
      dis6,
      dis7,
      dis8,
      dis9,
      dis10,
      pdf1,
      payment,
      pdf2,
      floorImg1,
      floorImg2,
      floorImg3,
      floorImg4,
      floorImg5,
      floorImg6,
      floorImg7,
      floorImg8,
      floorImg9,
      floorImg10,
      pdf3,
      logo1,
      logo2,
      logo3,
      logo4,
      logo5,
      logo6,
      logo7,
      logo8,
      logo9,
      logo10,
      logoText1,
      logoText2,
      logoText3,
      logoText4,
      logoText5,
      logoText6,
      logoText7,
      logoText8,
      logoText9,
      logoText10,
      virtualImg1,
      virtualImg2,
      virtualImg3,
      virtualImg4,
      virtualImg5,
      virtualImg6,
      virtualImg7,
      virtualImg8,
      virtualVid8,
      virtualVid9,
      virtualVid10
    } = req.body;

    // Ensure categories is an array
    const parsedCategories = Array.isArray(categories) ? categories : categories ? categories.split(',') : [];

    const newProperty = new Property({
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession: possession ? new Date(possession) : undefined,
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories: parsedCategories,
      imageUrl,
      dis1,
      dis2,
      dis3,
      dis4,
      dis5,
      dis6,
      dis7,
      dis8,
      dis9,
      dis10,
      pdf1,
      payment,
      pdf2,
      floorImg1,
      floorImg2,
      floorImg3,
      floorImg4,
      floorImg5,
      floorImg6,
      floorImg7,
      floorImg8,
      floorImg9,
      floorImg10,
      pdf3,
      logo1,
      logo2,
      logo3,
      logo4,
      logo5,
      logo6,
      logo7,
      logo8,
      logo9,
      logo10,
      logoText1,
      logoText2,
      logoText3,
      logoText4,
      logoText5,
      logoText6,
      logoText7,
      logoText8,
      logoText9,
      logoText10,
      virtualImg1,
      virtualImg2,
      virtualImg3,
      virtualImg4,
      virtualImg5,
      virtualImg6,
      virtualImg7,
      virtualImg8,
      virtualVid8,
      virtualVid9,
      virtualVid10
    });

    await newProperty.save();
    res.redirect('/');
  } catch (err) {
    console.error(err); // Log error details for debugging
    res.status(500).send('Server Error');
  }
});

app.post('/devdetails', isAdmin, async (req, res) => {
  try {
    const {
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession,
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories, // Should be an array of strings
      imageUrl,
      // New fields
      dis1,
      dis2,
      dis3,
      dis4,
      dis5,
      dis6,
      dis7,
      dis8,
      dis9,
      dis10,
      pdf1,
      payment,
      pdf2,
      floorImg1,
      floorImg2,
      floorImg3,
      floorImg4,
      floorImg5,
      floorImg6,
      floorImg7,
      floorImg8,
      floorImg9,
      floorImg10,
      pdf3,
      logo1,
      logo2,
      logo3,
      logo4,
      logo5,
      logo6,
      logo7,
      logo8,
      logo9,
      logo10,
      logoText1,
      logoText2,
      logoText3,
      logoText4,
      logoText5,
      logoText6,
      logoText7,
      logoText8,
      logoText9,
      logoText10,
      virtualImg1,
      virtualImg2,
      virtualImg3,
      virtualImg4,
      virtualImg5,
      virtualImg6,
      virtualImg7,
      virtualImg8,
      virtualVid8,
      virtualVid9,
      virtualVid10
    } = req.body;

    // Ensure categories is an array
    const parsedCategories = Array.isArray(categories) ? categories : categories ? categories.split(',') : [];

    const newProperty = new Detail({
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession: possession ? new Date(possession) : undefined,
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories: parsedCategories,
      imageUrl,
      dis1,
      dis2,
      dis3,
      dis4,
      dis5,
      dis6,
      dis7,
      dis8,
      dis9,
      dis10,
      pdf1,
      payment,
      pdf2,
      floorImg1,
      floorImg2,
      floorImg3,
      floorImg4,
      floorImg5,
      floorImg6,
      floorImg7,
      floorImg8,
      floorImg9,
      floorImg10,
      pdf3,
      logo1,
      logo2,
      logo3,
      logo4,
      logo5,
      logo6,
      logo7,
      logo8,
      logo9,
      logo10,
      logoText1,
      logoText2,
      logoText3,
      logoText4,
      logoText5,
      logoText6,
      logoText7,
      logoText8,
      logoText9,
      logoText10,
      virtualImg1,
      virtualImg2,
      virtualImg3,
      virtualImg4,
      virtualImg5,
      virtualImg6,
      virtualImg7,
      virtualImg8,
      virtualVid8,
      virtualVid9,
      virtualVid10
    });

    await newProperty.save();
    res.redirect('/');
  } catch (err) {
    console.error(err); // Log error details for debugging
    res.status(500).send('Server Error');
  }
});

// Handle adding new developer
app.post('/addTest', async (req, res) => {
  try {
    // Extract the data from the request body
    const { logo, name, longDescription, cityPresent } = req.body;

    // Create a new test instance
    const newTest = new Test({
      logo,
      name,
      longDescription,
      cityPresent,
    });

    // Save the test to the database
    await newTest.save();

    // Redirect to the admin dashboard or another route as needed
    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
// Handle adding new developer
app.post('/addDev', isAdmin, async (req, res) => {
  try {
    const {
      logo,
      name,
      established,
      project,
      shortDescription,
      longDescription,
      ongoingProjects,
      cityPresent,
    } = req.body;

    const newDeveloper = new Developer({
      logo,
      name,
      established,
      project,
      shortDescription,
      longDescription,
      ongoingProjects,
      cityPresent,
    });

    await newDeveloper.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin code verification route
app.post('/verify-code', (req, res) => {
  const { code } = req.body;
  const accessCode = '9671'; // Code to access the admin dashboard

  if (code === accessCode) {
    req.session.isAdmin = true;
    res.redirect('/admin');
  } else {
    res.status(401).send('Unauthorized');
  }
});


// Admin dashboard
app.get('/admin', isAdmin, async (req, res) => {
  try {
    const properties = await Property.find();
    const developers = await Developer.find();
    const details = await Detail.find();
    const users = await User.find();
    const tests = await Test.find(); // Fetch tests data

    res.render('admin-dashboard', { properties, developers, users, details, tests });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});





// Route to display edit property form (restricted to admin)
app.get('/admin/edit/property/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).send('Property not found');
    }
    res.render('editProperty', { property });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Route to display edit developer form (restricted to admin)
app.get('/admin/edit/developer/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const developer = await Developer.findById(id);
    if (!developer) {
      return res.status(404).send('Developer not found');
    }
    res.render('editDeveloper', { developer });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
app.get('/admin/edit/test/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const test = await Test.findById(id);
    if (!test) {
      return res.status(404).send('Developer not found');
    }
    res.render('editTest', { test });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Handle updating a property
app.post('/admin/update/property/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession,
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories, // Should be an array of strings
      imageUrl
    } = req.body;

    const updatedProperty = await Property.findByIdAndUpdate(id, {
      name,
      by,
      location,
      price,
      status,
      configuration,
      possession: possession ? new Date(possession) : undefined, // Convert to Date if present
      units,
      land,
      residence,
      builtup,
      blocks,
      floor,
      noofunits,
      rera,
      highlight,
      about,
      unitytype,
      size,
      range,
      booking,
      token,
      plans,
      amenities,
      virtual,
      categories: categories ? categories.split(',') : [], // Convert comma-separated string to array
      imageUrl
    }, { new: true });

    if (!updatedProperty) {
      return res.status(404).send('Property not found');
    }
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Handle updating a developer
app.post('/admin/update/developer/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      logo,
      name,
      established,
      project,
      shortDescription,
      longDescription,
      ongoingProjects,
      cityPresent,
    } = req.body;

    const updatedDeveloper = await Developer.findByIdAndUpdate(id, {
      logo,
      name,
      established,
      project,
      shortDescription,
      longDescription,
      ongoingProjects,
      cityPresent,
    }, { new: true });

    if (!updatedDeveloper) {
      return res.status(404).send('Developer not found');
    }
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});
app.post('/admin/update/test/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      logo,
      name,
      longDescription,
      cityPresent,
    } = req.body;

    const updatedTest = await Test.findByIdAndUpdate(id, {
      logo,
      name,
      longDescription,
      cityPresent,
    }, { new: true });

    if (!updatedTest) {
      return res.status(404).send('test not found');
    }
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Handle deletion of a property or developer
app.post('/admin/delete/:id', isAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const propertyDeletion = Property.findByIdAndDelete(id);
    const developerDeletion = Developer.findByIdAndDelete(id);
    const testDeletion = Test.findByIdAndDelete(id);

    await Promise.all([propertyDeletion, developerDeletion,testDeletion]);

    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
});


// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.post('/add-user', async (req, res) => {
  const { name, email, number } = req.body;

  // Basic validation
  if (!name || !email || !number) {
      return res.status(400).send('All fields are required');
  }

  try {
      // Create a new user instance and save it
      const user = new User({ name, email, number });
      await user.save();
      res.redirect('/'); // Redirect to the admin dashboard
  } catch (error) {
      console.error('Error saving user:', error);
      res.status(500).send('Internal Server Error');
  }
});

