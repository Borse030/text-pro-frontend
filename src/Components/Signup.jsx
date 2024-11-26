import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Styled components
const SignUpContainer = styled(Stack)(({ theme }) => ({
  width: '100%',
  maxWidth: '450px',
  padding: theme.spacing(4),
  margin: 'auto',
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
}));

const LeftContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  background: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const RightContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}));

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const navigate = useNavigate();

  const navigateToSignIn = () => {
    navigate("/signin");
  };

  const validateInputs = () => {
    let isValid = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password || password.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (!name || name.length < 1) {
      setNameError(true);
      setNameErrorMessage('Name is required.');
      isValid = false;
    } else {
      setNameError(false);
      setNameErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    
    try {
      const response = await fetch(`https://text-pro.onrender.com/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, userId: email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Sign up successful!');
        setTimeout(() => navigateToSignIn(), 1500); // Navigate after success
      } else {
        toast.error(result.message || 'Sign up failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error. Please try again later.');
    }
  };

  return (
    <Box
    sx={{
      display: 'flex',
      height: '100vh', // Full height of the viewport
      width: '100%',   // Full width
    }}
  >
    <ToastContainer />
  
    {/* Left Container */}
    <Box
      sx={{
        flex: 1, // Takes up equal space on the left
        padding: 4,
        backgroundColor: '#f0f0f0', // Light background for the text side
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center content vertically
        color: '#333',
      }}
    >
      <Typography variant="h3" gutterBottom sx={{ color: '#007bff' }}>
        Welcome to TextPro
      </Typography>
      <Typography variant="h6" paragraph>
        TextPro is your ultimate tool for handling text documents efficiently. With features including:
      </Typography>
      <Box component="ul" sx={{ paddingLeft: 2, listStyleType: 'disc', textAlign: 'left' }}>
       
        <Typography component="li" sx={{ marginBottom: 1 }}>
          <strong>Summarizer:</strong> Quickly extract key points from long documents.
        </Typography>
      
        <Typography component="li" sx={{ marginBottom: 1 }}>
          <strong>Translator:</strong> Break language barriers with accurate translations.
        </Typography>
        <Typography component="li" sx={{ marginBottom: 1 }}>
        <strong>Grammar Check:</strong> Identify and correct grammar mistakes effortlessly to improve your writing.
      </Typography>
      </Box>
    </Box>
  
    {/* Right Container */}
    <Box
      sx={{
        flex: 1, // Takes up equal space on the right
        padding: 4,
        backgroundColor: '#ffffff', // White background for the form
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Center the form vertically
        alignItems: 'center', // Center the form horizontally
        boxShadow: 3,
        borderLeft: '1px solid #e0e0e0', // Subtle border separating the two containers
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#007bff' }}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl>
            <FormLabel htmlFor="name" sx={{ color: '#007bff' }}>
              Full Name
            </FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Jon Snow"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? 'error' : 'primary'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#007bff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0056b3',
                  },
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email" sx={{ color: '#007bff' }}>
              Email
            </FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailErrorMessage}
              color={emailError ? 'error' : 'primary'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#007bff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0056b3',
                  },
                },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password" sx={{ color: '#007bff' }}>
              Password
            </FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordErrorMessage}
              color={passwordError ? 'error' : 'primary'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#007bff',
                  },
                  '&:hover fieldset': {
                    borderColor: '#0056b3',
                  },
                },
              }}
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: '#007bff',
              '&:hover': { backgroundColor: '#0056b3' }, // Darker blue on hover
              color: '#fff',
              padding: 1.5,
              borderRadius: 2,
            }}
          >
            Sign Up
          </Button>
          <Typography sx={{ textAlign: 'center', marginTop: 2 }}>
            Already have an account?{' '}
            <Link variant="body2" to="/signin" sx={{ color: '#007bff', textDecoration: 'none' }}>
              <b>Sign in</b>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
  
  
  
  );
};

export default SignUpPage;
