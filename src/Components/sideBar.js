import React, { useState, useEffect } from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SummarizeIcon from '@mui/icons-material/Summarize';
import TranslateIcon from '@mui/icons-material/Translate';
import ParaphraseIcon from '@mui/icons-material/AutoFixHigh'; // For paraphraser icon
import RuleIcon from '@mui/icons-material/Rule';
const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('summarizer'); // State to track active menu item
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuClick = (path, name) => {
    console.log('123  ', name)
    setActiveItem(name);
    navigate(path);
  };

 useEffect(() => {
  // alert(window.location.pathname.replace(/^\//, ''))
 
 if( window.location.pathname.replace(/^\//, '') == "summariser"){
  setActiveItem("summarizer")
 }else {
  setActiveItem(window.location.pathname.replace(/^\//, ''))
 }
  
 }, [])


  return (
    <Sidebar
      collapsed={isCollapsed}
      style={{
        position: 'absolute',
        left: '0',
      
        height: '100vh',
        transition: 'all 0.3s ease', // Smooth transition on collapse
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)', // Subtle shadow for depth
      }}
    >
    <div style={{backgroundColor:"blue", height:"100%", width:"100%"}}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center', // Center the icon
          alignItems: 'center',
          padding: '20px 0', // Add padding
          cursor: 'pointer', // Pointer on hover
          transition: 'all 0.3s ease',
          backgroundColor: 'blue', // Your custom color
          color: 'white',
        }}
        onClick={toggleSidebar}
      >
        <EditNoteIcon style={{ color: '#ffffff', fontSize: '2rem' }} /> {/* White icon for toggle */}
      </div>

      <Menu
        menuItemStyles={{
          button: {
            padding: '12px 20px',
            borderRadius: '8px', // Rounded menu items
            marginBottom: '10px',
            transition: 'background-color 0.3s ease, color 0.3s ease', // Smooth hover effect
            [`&:hover`]: {
              backgroundColor: 'white !important', // Slightly lighter on hover
              color: 'blue !important',
            },
            [`&.active`]: {
              // Blue for active text
              fontWeight: 'bold',
            },
          },
        }}
      >
        <MenuItem
        style={{ color: activeItem === 'summarizer' ? 'blue' : 'white', backgroundColor: activeItem === 'summarizer' ? 'white' : 'blue' }} 

          icon={
            <SummarizeIcon
            />
          }
          active={activeItem === 'summarizer'}
          onClick={() => handleMenuClick('/summariser', 'summarizer')}
        >
          Summariser
        </MenuItem>

        <MenuItem
        style={{ color: activeItem === 'translator' ? 'blue' : 'white', backgroundColor: activeItem === 'translator' ? 'white' : 'blue' }} 
          icon={
            <TranslateIcon
             // Color change for active/inactive icons
            />
          }
          active={activeItem === 'translator'}
          onClick={() => handleMenuClick('/translator', 'translator')}
        >
          Translator
        </MenuItem>

        <MenuItem
        style={{ color: activeItem === 'grammerCheck' ? 'blue' : 'white', backgroundColor: activeItem === 'grammerCheck' ? 'white' : 'blue' }} 
          icon={
            <RuleIcon
             // Color change for active/inactive icons
            />
          }
          active={activeItem === 'grammerCheck'}
          onClick={() => handleMenuClick('/grammerCheck', 'grammerCheck')}
        >
          Grammer Check
        </MenuItem>

     
      </Menu>
      </div>
    </Sidebar>
  );
};

export default SideBar;
