import { useState } from 'react';
import axios from 'axios';
import { 
  Box, Button, CircularProgress, Container, CssBaseline, 
  Paper, Typography, ThemeProvider, createTheme, 
  Grid, Card, CardContent, 
  Avatar, LinearProgress
} from '@mui/material';
import { 
  CloudUpload, Science, 
  Healing, Biotech, ModelTraining 
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';

// Medical Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Doctor's scrubs blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#2e7d32', // Medical green
    },
    background: {
      default: '#f5f9ff', // Light hospital blue
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", sans-serif',
    h4: {
      fontWeight: 600,
      color: '#1a3e72', // Dark medical blue
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0 2px 10px rgba(25, 118, 210, 0.2)',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        },
      },
    },
  },
});

const MODELS = [
  {
    id: 'unet_t1c',
    name: '3D U-Net',
    modality: 'T1 Contrast',
    icon: <Healing fontSize="large" />,
    color: '#1976d2',
    accuracy: '92%',
    speed: 'Fast'
  },
  {
    id: 'deepmedic',
    name: 'DeepMedic',
    modality: 'Multimodal',
    icon: <Biotech fontSize="large" />,
    color: '#2e7d32',
    accuracy: '94%',
    speed: 'Medium'
  },
  {
    id: 'nnunet',
    name: 'nnU-Net',
    modality: 'Ensemble',
    icon: <ModelTraining fontSize="large" />,
    color: '#9c27b0',
    accuracy: '96%',
    speed: 'Slow'
  }
];

export default function App() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedModel, setSelectedModel] = useState(MODELS[0].id);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.zip',
    maxFiles: 1,
    onDrop: acceptedFiles => setFile(acceptedFiles[0])
  });

  const processImage = async () => {
    setIsProcessing(true);
    setProgress(0);
    
    // Simulate progress (replace with real progress in actual app)
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 90 ? 90 : prev + 10));
    }, 500);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('model', selectedModel);
      
      const response = await axios.post('http://localhost:5000/process', formData, {
        onUploadProgress: progressEvent => {
          setProgress(Math.round((progressEvent.loaded * 90) / progressEvent.total));
        }
      });
      
      setResult(response.data);
      setProgress(100);
    } catch (error) {
      console.error(error);
      alert(`Processing failed: ${error.response?.data?.error || error.message}`);
    } finally {
      clearInterval(interval);
      setIsProcessing(false);
    }
  };

  const selectedModelData = MODELS.find(m => m.id === selectedModel);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        minHeight: '100vh',
        background: `
          linear-gradient(135deg, #f0f7ff 0%, #f5fff0 100%),
          url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" opacity="0.05"><path d="M30,10L50,30L70,10L90,30L70,50L90,70L70,90L50,70L30,90L10,70L30,50L10,30L30,10Z" fill="%231976d2"/></svg>')
        `,
        backgroundBlendMode: 'overlay',
        padding: '2rem 0',
      }}>
        <Container maxWidth="lg">
          {/* Header */}
<Box sx={{ 
  display: 'flex', 
  alignItems: 'center', 
  mb: 4,
  color: theme.palette.primary.main
}}>
  <img 
    src="/haske.1abc5396a949ee6e3423.png" // Path to your logo in the public folder
    alt="Logo"
    style={{ 
      height: '48px', 
      marginRight: '16px',
      filter: 'drop-shadow(0 2px 4px rgba(25, 118, 210, 0.3))'
    }} 
  />
  <Box>
    <Typography variant="h3" sx={{ 
      fontWeight: 700,
      background: 'linear-gradient(90deg, #1976d2, #2e7d32)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent'
    }}>
      AI
    </Typography>
    <Typography variant="subtitle1" color="text.secondary">
      Model Platform
    </Typography>
  </Box>
</Box>

          <Grid container spacing={4}>
            {/* Left Column - Input */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3}>
                <Box sx={{ 
                  p: 3,
                  background: 'linear-gradient(135deg, #1976d210 0%, #2e7d3210 100%)'
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.dark
                  }}>
                    <Science sx={{ mr: 1 }} /> Input Data
                  </Typography>

                  {/* Model Selection Cards */}
<Box sx={{ mb: 3 }}>
  <Typography variant="subtitle2" gutterBottom>
    SELECT MODEL:
  </Typography>
  <Box sx={{
    display: 'flex',
    overflowX: 'auto',
    gap: 2,
    pb: 2,
    scrollbarWidth: 'thin',
    '&::-webkit-scrollbar': {
      height: '6px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#555',
    }
  }}>
    {MODELS.map((model) => (
      <Card 
        key={model.id}
        onClick={() => setSelectedModel(model.id)}
        sx={{
          minWidth: 220,
          cursor: 'pointer',
          border: selectedModel === model.id ? `2px solid ${model.color}` : '2px solid transparent',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: `0 4px 12px ${model.color}20`
          },
          flexShrink: 0
        }}
      >
        <CardContent sx={{ textAlign: 'center' }}>
          <Avatar sx={{ 
            bgcolor: `${model.color}20`, 
            color: model.color,
            width: 56,
            height: 56,
            margin: '0 auto 1rem',
          }}>
            {model.icon}
          </Avatar>
          <Typography variant="h6">{model.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {model.modality}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            mt: 1,
            fontSize: '0.75rem'
          }}>
            <span>Accuracy: {model.accuracy}</span>
            <span>Speed: {model.speed}</span>
          </Box>
        </CardContent>
      </Card>
    ))}
  </Box>
</Box>

                  {/* File Upload */}
                  <Box {...getRootProps()} sx={{
                    border: '2px dashed',
                    borderColor: theme.palette.primary.main,
                    borderRadius: '8px',
                    padding: '2rem',
                    textAlign: 'center',
                    backgroundColor: '#ffffff60',
                    backdropFilter: 'blur(4px)',
                    cursor: 'pointer',
                    mb: 2,
                    transition: 'all 0.3s',
                    '&:hover': {
                      backgroundColor: '#ffffff90',
                      borderColor: theme.palette.primary.dark
                    }
                  }}>
                    <input {...getInputProps()} />
                    <CloudUpload sx={{ 
                      fontSize: 48, 
                      color: theme.palette.primary.main,
                      mb: 1 
                    }} />
                    <Typography variant="h6">
                      {file ? file.name : "Upload DICOM Study"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Drag & drop a ZIP archive or click to browse
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      display: 'block',
                      mt: 1,
                      color: theme.palette.primary.dark
                    }}>
                      Supports: .zip (DICOM series)
                    </Typography>
                  </Box>

                  {/* Processing Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={processImage}
                    disabled={!file || isProcessing}
                    sx={{
                      mt: 2,
                      height: '48px',
                      fontSize: '1rem',
                      background: `linear-gradient(90deg, ${selectedModelData.color}, ${theme.palette.primary.main})`
                    }}
                  >
                    {isProcessing ? (
                      <>
                        <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                        Analyzing...
                      </>
                    ) : (
                      `Run ${selectedModelData.name} Analysis`
                    )}
                  </Button>

                  {/* Progress Bar */}
                  {isProcessing && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{
                          height: '8px',
                          borderRadius: '4px',
                          '.MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${selectedModelData.color}, ${theme.palette.primary.main})`
                          }
                        }} 
                      />
                      <Typography variant="caption" sx={{ 
                        display: 'block',
                        textAlign: 'right',
                        mt: 0.5
                      }}>
                        {progress}% complete
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Right Column - Results */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ height: '100%' }}>
                <Box sx={{ 
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)'
                }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    color: theme.palette.primary.dark
                  }}>
                    <Healing sx={{ mr: 1 }} /> Analysis Results
                  </Typography>

                  {result ? (
                    <>
                      {/* Segmentation Result */}
                      <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        mb: 3
                      }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Segmentation Overlay
                        </Typography>
                        <Box sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          flex: 1,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f5f5f5'
                        }}>
                          <img 
                            src={`data:image/png;base64,${result.image}`} 
                            alt="Segmentation result" 
                            style={{ 
                              maxWidth: '100%',
                              maxHeight: '300px',
                              objectFit: 'contain'
                            }} 
                          />
                        </Box>
                      </Box>

                      {/* Clinical Findings */}
                      <Paper elevation={0} sx={{ 
                        p: 2,
                        mb: 3,
                        background: '#f5f9ff',
                        borderLeft: `4px solid ${selectedModelData.color}`
                      }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Clinical Findings
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Tumor Volume:</strong> 14.7 cm³
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Confidence:</strong> 92%
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Location:</strong> Right temporal lobe
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">
                              <strong>Notes:</strong> Enhancing lesion with necrotic core
                            </Typography>
                          </Grid>
                        </Grid>
                      </Paper>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button 
                          variant="contained"
                          color="primary"
                          fullWidth
                        >
                          Save Report
                        </Button>
                        <Button 
                          variant="outlined"
                          color="secondary"
                          fullWidth
                        >
                          Compare Studies
                        </Button>
                      </Box>
                    </>
                  ) : (
                    <Box sx={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'text.secondary'
                    }}>
                      <Box>
                        <Science sx={{ fontSize: 60, opacity: 0.3, mb: 1 }} />
                        <Typography variant="h6">
                          {isProcessing ? 'Processing...' : 'Results will appear here'}
                        </Typography>
                        <Typography variant="body2">
                          {isProcessing ? '' : 'Upload and analyze a DICOM study to begin'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {/* Footer */}
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Haske AI v1.0 | For Research Use Only
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}