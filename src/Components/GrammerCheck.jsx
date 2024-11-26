import React, { useRef, useState, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./GrammerCheck.css";
import Loader from './Loader';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import UploadIcon from '@mui/icons-material/Upload';

const GrammerCheck = () => {
    const [userText, setUserText] = useState('');
    const [suggestedText, setSuggestedText] = useState('');
    const [loading, setLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [totalWords, setTotalWords] = useState(0);
    const [totalWords2, setTotalWords2] = useState(0);

    const editorConfig = useMemo(() => ({
        readonly: false,
        toolbar: false,
        branding: false,
        toolbarSticky: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        iframe: false,
        height: 400,
        resize: null
    }), []);

    const userEditor = useRef(null);
    const suggestionEditor = useRef(null);

    const handleGrammarCheck = async () => {
        const plainText = htmlToText(userText);
        setLoading(true);

        try {
            const response = await axios.post(`https://text-pro.onrender.com/GrammarCheck`, {
                data: { text: plainText },
            });
console.log("text  ", response.data.aiResponse)
            if (response.data.noErrors) {
                toast.success("No grammar mistakes found.");
                setSuggestedText('');
            } else {
                const highlightedText = applyHighlighting(response.data.aiResponse.result);
                setSuggestedText(highlightedText);
                toast.info("Grammar check completed! See suggestions below.");
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to check grammar. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptChanges = () => {
        setUserText(suggestedText);
        setSuggestedText('');
    };

    const handleRejectChanges = () => {
        setSuggestedText('');
    };

    const htmlToText = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    };

    const applyHighlighting = (correctedText) => {
        // This function assumes the backend has returned corrected text with `span` tags 
        // wrapping each mistake. For example:
        // "This is <span class='highlight-error'>wrong</span> text."
        return correctedText.replace(/<span class="highlight-error">(.*?)<\/span>/g, (match, p1) => {
            return `<span class="highlight-error">${p1}</span>`;
        });
    };






const handleChange = (newContent) => {

    let  newState = htmlToText(newContent);



    let hasText = newState.split(/\s+/).length>0 && newState !== "";
       
    const wordCount = newState.split(/\s+/).length;

    console.log("wordcount", wordCount,  newState)

    if (wordCount > 1000) {
        toast.warn("Word count exceeded than 1000")
        console.log("maxwords", wordCount)
        return
    }

    setUserText(newContent)


    setTotalWords(hasText ? wordCount : 0)
}

const handleDeleteClick = () => {
    setUserText("")
}


const handleChange2 = () => {

    let  newState = htmlToText(suggestedText);

    let hasText = newState.split(/\s+/).length>0 && newState !== "";
       
    const wordCount = newState.split(/\s+/).length;

    setTotalWords2(hasText ? wordCount : 0)



}

    return (
        <Container style={{ paddingTop: '20px', paddingLeft: '200px' }} className='one'>
            <ToastContainer />
            {loading && <Loader />}
          
            <Row className="mb-4">
                <Col>
                    <h4>Your Text</h4>
                    <JoditEditor
                        ref={userEditor}
                        value={userText}
                        config={editorConfig}
                        onBlur={(newContent) => setUserText(newContent)}
                        onChange={(newContent) => handleChange(newContent)}
                    />
                    <div className='container-fluid' style={{backgroundColor:"white", width: "100%",height:"13%",  padding: '13px 12px', borderRadius: '10px', boxShadow: '1px 1px 6px 0px' }}>
                    <div className='summ-nav' style={{ display: 'flex', justifyContent: 'space-between', flexDirection: windowWidth < 920 ? "column" : 'row', alignItems: windowWidth < 920 ? "center" : '' }}>
                        <div className='total-words' style={{ marginBottom: windowWidth < 920 ? "12px" : '' }}>
                            <div className='mt-2' style={{ fontWeight: "bold", color: "#1976d2", fontSize: '12px' }}>
                                <b>{totalWords > 0 && `${totalWords} Words || 1000 Words limit`}</b>
                            </div>
                        </div>

                        <div className='buttons-summ'  >
                            <div className='d-flex justify-content-end'>
                                <div className='px-2'>
                                    <Button
                                        style={{ border: "none", background: "transparent", minWidth: '20px', padding: '0px', color: 'red' }}
                                       onClick={handleDeleteClick}
                                    >
                                        <DeleteIcon />
                                    </Button>
                                </div>
                              
                               
                           
                                <div className='px-2'>
                                <Button variant="primary" onClick={handleGrammarCheck}>
                                Check Grammar
                            </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </Col>
                <Col>
                    <h4>Suggested Corrections</h4>
                    <JoditEditor
                        ref={suggestionEditor}
                        value={suggestedText}
                        config={{ ...editorConfig, readonly: false }}
                        onChange={() => handleChange2()}
                    />


                    <div className='container-fluid' style={{backgroundColor:"white",  width: "100%",height:"13%", padding: '13px 12px', borderRadius: '10px', boxShadow: '1px 1px 6px 0px' }}>
                    <div className='summ-nav' style={{ display: 'flex', justifyContent: 'space-between', flexDirection: windowWidth < 920 ? "column" : 'row', alignItems: windowWidth < 920 ? "center" : '' }}>
                        <div className='total-words' style={{ marginBottom: windowWidth < 920 ? "12px" : '' }}>
                            <div className='mt-2' style={{ fontWeight: "bold", color: "#1976d2", fontSize: '12px' }}>
                                <b>{ `${totalWords2} Words `}</b>
                            </div>
                        </div>
                        <div>
                        <Button variant="success" onClick={handleAcceptChanges} disabled={!suggestedText}>
                        Accept Changes
                    </Button>
                    <Button variant="danger" onClick={handleRejectChanges} disabled={!suggestedText}>
                        Reject
                    </Button>
                    </div>
                    </div>
                    
                </div>








                 
                </Col>
                
            </Row>
        
        </Container>
    );
};

export default GrammerCheck;
