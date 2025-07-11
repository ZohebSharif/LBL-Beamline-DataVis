import "./App.css";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import BerkeleyLabLogo from './assets/berkeley-lab-logo.svg';
import DoeLogo from './assets/doe-logo.svg';
import UcLogo from './assets/uc-logo.svg';
import AddButton from './assets/add-button.png';
import FacebookIcon from './assets/facebook.svg?react';
import InstagramIcon from './assets/instagram.svg?react';
import XIcon from './assets/x.svg?react';
import SearchIcon from './assets/search.svg?react';
import YoutubeIcon from './assets/youtube.svg?react';
import EmailIcon from './assets/email.svg?react';
import LinkedinIcon from './assets/linkedin.svg?react';
import PublicationCarousel from "./PublicationCarousel";
import DoiLiveSearch from "./DoiLiveSearch";

 const categories = [
    "chemistry and energy",
    "physics and condensed matter", 
    "bioscience",
    "geoscience and environment"
  ];
  
function Admin() {
  const currentBeamline = 'Beamline 8.3.2'
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    doi: '',
    title: '',
    abstract: '',
    authors: '',
    categories: '', // Which category carousel to display this publication in
    files: [] as File[]
  });
  const [dragActive, setDragActive] = useState(false);

  const handleBackToUserView = () => {
    navigate('/');
  };

  const handleAddButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form data when closing
    setFormData({
      doi: '',
      title: '',
      abstract: '',
      authors: '',
      categories: '', // Reset category selection
      files: []
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const handlePublicationSelect = (publication: {
    id: number;
    title: string;
    authors: string;
    journal: string;
    online_pub_date: string;
    doi: string;
    beamlines: string;
    year: string;
    high_impact: number;
  }) => {
    console.log('Auto-populating form from DOI search:', publication);
    setFormData(prev => ({
      ...prev,
      doi: publication.doi || '',
      title: publication.title || '',
      authors: publication.authors || ''
      // Note: categories remains unchanged - admin must select display category
    }));
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Please enter a title for the publication.');
      return;
    }
    if (!formData.abstract.trim()) {
      alert('Please enter an abstract for the publication.');
      return;
    }
    if (!formData.authors.trim()) {
      alert('Please enter the author(s) for the publication.');
      return;
    }
    if (!formData.categories.trim()) {
      alert('Please select which category carousel should display this publication.');
      return;
    }

    // Success feedback
    console.log('Submitting publication:', formData);
    alert(`Publication "${formData.title}" will be added to the "${formData.categories.charAt(0).toUpperCase() + formData.categories.slice(1)}" category carousel and will be visible to users.`);
    handleCloseModal();
  };
  
  return (
    <div className="App">
      <div className="AppTopHeader">
        <img src={BerkeleyLabLogo} alt="logo" style={{ filter: 'brightness(0) invert(1)' }} className="headerImage"></img>
      </div>
      
      <div className="header">
        <div className="searchbox" >
          <input className="inputBox" placeholder=" Search" ></input>
          <SearchIcon style={{ fill: '#00313c', width: '20px', height: '20px' }} />
        </div>

        <div className="headerLinks">
            <strong>
                <a href="https://als.lbl.gov/" style={{ textDecoration: 'none' }}>ALS</a>
            </strong>
            <strong>
                <a href="https://als.lbl.gov/beamlines/" style={{ textDecoration: 'none' }}>Beamlines</a>
            </strong>
            <strong>
                <a href="https://als.lbl.gov/beamlines/" style={{ textDecoration: 'none' }}>{currentBeamline}</a>
            </strong>
        </div>

        <div className="buttonContainer">
        <button className="buttonOne">
           <div className="textOne">
            <strong>Web View</strong>
            </div>
          </button>

         <button className="buttonTwo">
          <div className="textTwo">
            <strong>Slideshow View</strong>
          </div>
         </button>

         {/* Add Button */}
         <button 
           onClick={handleAddButtonClick}
           style={{
             background: 'none',
             border: 'none',
             padding: '0',
             cursor: 'pointer',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             transition: 'transform 0.2s ease'
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'scale(1.1)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'scale(1)';
           }}
         >
           <img 
             src={AddButton} 
             alt="Add Publication" 
             style={{ 
               width: '40px', 
               height: '40px' 
             }} 
           />
         </button>

         <div className="selected">
           <p style = {{color:"#676767"}}>Selected:</p>
           <u style = {{color:"#676767"}}>{currentBeamline}</u>
         </div>
       </div>
      </div>

      {/* Back to User View Button */}
      <div style={{
        position: 'relative',
        width: '100%',
        padding: '15px 0 10px 2vw',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <button style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#00313c',
          color: 'white',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: '"ATF Franklin Gothic", sans-serif',
          textDecoration: 'none',
          transition: 'all 0.2s ease',
          border: 'none',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#FFCB70';
          e.currentTarget.style.color = '#00313c';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#00313c';
          e.currentTarget.style.color = 'white';
        }}
        onClick={handleBackToUserView}
        >
          <span style={{ fontSize: '16px' }}>←</span>
          Back to User View
        </button>
      </div>
      
      <div className="Body">
        <PublicationCarousel category={categories[0]}/>
        <PublicationCarousel category={categories[1]}/>
        <PublicationCarousel category={categories[2]}/>
        <PublicationCarousel category={categories[3]}/>
        <div style={{ paddingTop: '20px' }}></div>

        <div className="Footer">
          <div className="footer-main">
            <div className="footer-content">
              <div className="footer-section">
                <h1>EASY PUBLICATION</h1>
                <h2>Berkeley Lab Publishing Platform</h2>
              </div>

              <div className="footer-section">
                <h2>Platform</h2>
                <div className="footer-links">
                  <p>Features</p>
                  <p>Templates</p>
                  <p>About Us</p>
                  <p><a href="https://login.lbl.gov/idp/profile/SAML2/Redirect/SSO?execution=e1s2">Admin Login</a></p>
                </div>
              </div>

              <div className="footer-section">
                <h2>Resources</h2>
                <div className="footer-links">
                  <p>A-Z Index</p>
                  <p>CSA Staff Login</p>
                  <p>Report a Bug</p>
                </div>
              </div>

              <div className="footer-section">
                <h2>Connect</h2>
                <div className="social-icons">
                  <div className="social-icon">
                    <a href="https://www.facebook.com/BerkeleyLab" target="_blank" rel="noopener noreferrer">
                      <FacebookIcon />
                    </a>
                  </div>
                  <div className="social-icon">
                    <a href="https://www.instagram.com/berkeleylab/" target="_blank" rel="noopener noreferrer">
                      <InstagramIcon />
                    </a>
                  </div>
                  <div className="social-icon">
                    <a href="https://x.com/BerkeleyLab" target="_blank" rel="noopener noreferrer">
                      <XIcon />
                    </a>
                  </div>
                  <div className="social-icon">
                    <a href="https://www.youtube.com/user/AdvancedLightSource" target="_blank" rel="noopener noreferrer">
                      <YoutubeIcon />
                    </a>
                  </div>
                  <div className="social-icon">
                    <a href="mailto:cscomms@lbl.gov">
                      <EmailIcon />
                    </a>
                  </div>
                  <div className="social-icon">
                    <a href="https://www.linkedin.com/company/lawrence-berkeley-national-laboratory/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                      <LinkedinIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-middle">
            <img src={BerkeleyLabLogo} alt="Berkeley Lab Logo" className="footer-logo" />
            <div className="footer-links-bottom">
              <span>
                <a href="https://www.lbl.gov/contact/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
                {" | "}
                <a href="https://visits.lbl.gov/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Visit Us</a>
                {" | "}
                <a href="https://www.lbl.gov/subscribe/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Subscribe</a>
              </span>
            </div>
            <div className="partner-logos">
              <img src={DoeLogo} alt="DOE Logo" className="partner-logo" />
              <img src={UcLogo} alt="UC Logo" className="partner-logo" />
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-content">
              <p className="footer-description">
                Lawrence Berkeley National Laboratory is a U.S. DOE Office of Science<br />
                national laboratory managed by the University of California
              </p>

              <div className="footer-links-bottom">
                <span>
                  <a href="https://phonebook.lbl.gov/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Staff Directory</a>
                  {" | "}
                  <a href="https://elements.lbl.gov/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>For Employees</a>
                  {" | "}
                  <a href="https://status.lbl.gov/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Emergency Status</a>
                  {" | "}
                  <a href="https://www.lbl.gov/terms-and-conditions/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy & Security Notice</a>
                  {" | "}
                  <a href="https://www.lbl.gov/web-support/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>Site Feedback</a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            width: '700px',
            height: '90vh',
            maxHeight: '900px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
            position: 'relative',
            fontFamily: '"Inter", sans-serif',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Header */}
            <div style={{
              padding: '20px 30px 15px 30px',
              borderBottom: '1px solid #e0e0e0',
              position: 'relative',
              flexShrink: 0
            }}>
              {/* Document Icon */}
              <div style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                marginBottom: '12px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" fill="#000000"/>
                  <path d="M14 2V8H20" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              {/* Title and DOI Row */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '30px'
              }}>
                <h2 style={{
                  margin: '0',
                  color: '#181d27',
                  fontSize: '18px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  Add a Publication
                </h2>
                <p style={{
                  margin: '4px 0 0 0',
                  color: '#666',
                  fontSize: '13px',
                  fontWeight: '400'
                }}>

                </p>
                
                {/* DOI Input */}
                <div style={{ width: '220px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#414651',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    DOI
                  </label>
                  <div style={{ position: 'relative' }}>
                    <DoiLiveSearch
                      value={formData.doi}
                      onChange={(value) => handleInputChange('doi', value)}
                      onSelectPublication={handlePublicationSelect}
                    />
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div style={{
              padding: '20px 30px',
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Title */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  color: '#414651',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Title *
                </label>
                <input
                  type="text"
                  placeholder="What is the title?"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                  style={{
                    width: '70%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              {/* Abstract */}
              <div style={{ marginBottom: '18px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '6px',
                  color: '#414651',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Abstract *
                </label>
                <textarea
                  placeholder="e.g. Lorem ipsum dolor sit amet consectetur adipiscing elit. Amet consectetur adipiscing elit quisque faucibus ex sapien."
                  value={formData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  required
                  rows={3}
                  style={{
                    width: '70%',
                    padding: '8px 12px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '6px',
                    fontSize: '14px',
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                  }}
                />
              </div>

              {/* Authors and Categories Row */}
              <div style={{
                display: 'flex',
                gap: '40px',
                marginBottom: '18px'
              }}>
                {/* Authors */}
                <div style={{ width: '35%' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#414651',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Author(s) *
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Zoheb Sharif"
                    value={formData.authors}
                    onChange={(e) => handleInputChange('authors', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
                    }}
                  />
                </div>

                {/* Display Category */}
                <div style={{ width: '35%' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '6px',
                    color: '#414651',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    Display Category *
                  </label>
                  <select
                    value={formData.categories}
                    onChange={(e) => handleInputChange('categories', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      fontSize: '14px',
                      outline: 'none',
                      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                      backgroundColor: 'white',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="" disabled>Choose Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>

                  </div>
                </div>
              </div>

              {/* File Upload */}
              <div style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    border: `2px dashed ${dragActive ? '#00313c' : '#ccc'}`,
                    borderRadius: '8px',
                    padding: '20px 15px',
                    textAlign: 'center',
                    backgroundColor: dragActive ? '#f8f9fa' : '#fafafa',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {/* Upload Icon */}
                  <div style={{
                    fontSize: '32px',
                    color: '#00313c',
                    marginBottom: '8px'
                  }}>
                    ☁️
                  </div>
                  
                  <p style={{
                    margin: '0 0 5px 0',
                    color: '#000',
                    fontSize: '13px',
                    fontFamily: 'Helvetica, sans-serif'
                  }}>
                    Select a file or drag and drop here
                  </p>
                  
                  <p style={{
                    margin: '0 0 15px 0',
                    color: 'rgba(0, 0, 0, 0.4)',
                    fontSize: '11px',
                    fontFamily: 'Helvetica, sans-serif'
                  }}>
                    JPG, PNG or PDF, file size no more than 10MB
                  </p>
                  
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                    id="file-input"
                  />
                  
                  <label
                    htmlFor="file-input"
                    style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      backgroundColor: '#fbfdfe',
                      color: '#0f91d1',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '10px',
                      fontFamily: 'Helvetica, sans-serif',
                      border: '1px solid #0f91d1'
                    }}
                  >
                    Select file
                  </label>
                  
                  {formData.files.length > 0 && (
                    <div style={{
                      marginTop: '10px',
                      fontSize: '11px',
                      color: '#666'
                    }}>
                      {formData.files.length} file(s) selected
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                marginTop: 'auto',
                paddingTop: '15px',
                borderTop: '1px solid #e0e0e0',
                flexShrink: 0
              }}>
                <button
                  onClick={handleCloseModal}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#ffffff',
                    color: '#414651',
                    border: '1px solid #414651',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    minWidth: '140px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f5f5f5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmit}
                  style={{
                    padding: '16px 32px',
                    backgroundColor: '#10303b',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                    minWidth: '180px',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0d262f';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#10303b';
                  }}
                >
                  Add to Collection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
