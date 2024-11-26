import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, TextField, Typography, Stack, IconButton, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Styled components
const SignInContainer = styled(Stack)(({ theme }) => ({
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

const Signin = ({onSignIn}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

  const navigate = useNavigate();

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

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch(`https://text-pro.onrender.com/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.info(result.message || 'Sign in successful!');
         
        navigate('/summariser')
        onSignIn();
     
      } else {
        toast.error(result.message || 'Sign in failed!');
       
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Server error. Please try again later.');
    }
  };


  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };




  return (
    <Box
    sx={{
      display: 'flex',
      height: '100vh', // Full height of the viewport
      width: '100%',   // Full width
    }}
  >
  
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
        Welcome Back to TextPro
      </Typography>
      <Typography variant="h6" paragraph>
        Access all your favorite text handling tools and improve your productivity:
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
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError}
            helperText={passwordErrorMessage}
            color={passwordError ? 'error' : 'primary'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleTogglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
            Sign In
          </Button>
          <Typography sx={{ textAlign: 'center', marginTop: 2 }}>
            Don't have an account?{' '}
            <Link variant="body2" to="/signup" sx={{ color: '#007bff', textDecoration: 'none' }}>
              <b>Sign up</b>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  </Box>
  
  );
};

export default Signin;
