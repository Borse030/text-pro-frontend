

import React, { useEffect, useState, useRef, useMemo } from 'react';

import Editor from 'jodit-react';

import Button from '@mui/material/Button'
import MicIcon from '@mui/icons-material/Mic';
import UploadIcon from '@mui/icons-material/Upload';

import Box from '@mui/material/Box';
import { Slider } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import mammoth from 'mammoth';
import Swal from 'sweetalert2';

import DeleteIcon from '@mui/icons-material/Delete';

import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';
import Loader from "./Loader"
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from "styled-components";



const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});


const Summariser = () => {
    const [loading, setLoading] = useState(false);
    const [editorState1, setEditorState1] = useState(null);
    const [summariseText, setSummariseText] = useState(null)

    const [editorStatePara, setEditorStatePara] = useState("");
    const [paragraphState, setParagraphState] = useState()
    const [selectedButtons, setSelectedButtons] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [totalWords, setTotalWords] = useState(0);
    const [totalWords2, setTotalWords2] = useState(0);
    const [activeLink, setActiveLink] = useState(null);
    const [APIData, setAPIData] = useState(false);
    const [sliderValue, setSliderValue] = useState(0);
    const [sliderText, setSliderText] = useState("Shorten")
    const [keywords, setKeywords] = useState([])
    const [selectedKeywords, setSelectedKeywords] = useState()
    const [isBulletPoints, setIsBulletPoints] = useState(false)
    const [noOfBullets, setNoOfBullets] = useState(0)
    const [isParagraph, setIsParagraph] = useState(false)
    const [isCustom, setIsCustom] = useState(false)
    const [customPrompt, setCustomPrompt] = useState("")
    const [isKeyword, setIsKeyword] = useState(false)
    const [maxCountDisplayed, setMaxCountDisplayed] = useState(false)
    const [isSummarize, setIsSummarize] = useState(false)
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isRecording, setIsRecording] = useState(false);
    const [isContinuousListening, setIsContinuousListening] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [inputKey, setInputKey] = useState();
    const [editorState2, setEditorState2] = useState();
    const [originalText, setOriginalText] = useState("")
    const [paraphrasedText, setParaphrasedText] = useState("")
    const editor = useRef(null);
    const editor2 = useRef(null);


    function focusEditor() {
        editor.current.focus();
    }
    const config = useMemo(() => ({
        readonly: false,
        toolbar: false,
        branding: false,
        toolbarSticky: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        iframe: false  // Ensure no iframe wrapping
    }), []);

     const config2 = useMemo(() => ({
        readonly: true,
        toolbar: false,
        branding: false,
        toolbarSticky: false,
        showCharsCounter: false,
        showWordsCounter: false,
        showXPathInStatusbar: false,
        iframe: false  // Ensure no iframe wrapping
    }), []);
   
    const editorContainerStyle = windowWidth < 768 ? {

        boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
        padding: '18px 15px',
        borderRadius: '8px 8px 0px 0px',
        background: 'white',
        height: windowWidth < 546 ? "25vh" : "34vh",
        overflowY: 'auto',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box',

    } : {
        boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
        padding: '18px 15px',
        borderRadius: '8px 8px 0px 0px',
        background: 'white',
        height: "50vh",
        overflowY: 'auto',
        width: '100%',
        maxWidth: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
    };

    let [keyCode, setKeyCode] = useState(null)
    const sliderMarks = [
        {
            value: 0,
            label: '0%',
        },
        {
            value: 20,
            label: '20%',
        },
        {
            value: 40,
            label: '40%',
        },
        {
            value: 60,
            label: '60%',
        },
        {
            value: 80,
            label: '80%',
        },
        {
            value: 100,
            label: '100%',
        },
    ]




    const handleOnChange = (newState) => {
        let plainText = htmlToText(editor.current.value);
        console.log("DOT", plainText)

        let hasText = plainText.split(/\s+/).length>0 && plainText !== "";
       
        const wordCount = plainText.split(/\s+/).length;

        console.log("wordcount", wordCount,  plainText)

        if (wordCount > 1000) {
            toast.warn("Word count exceeded than 1000")
            console.log("maxwords", wordCount)
            return
        }

        setEditorState1(newState)


        setTotalWords(hasText ? wordCount : 0)

    }
    const handleEditorChange2 = (newState2) => {
       let  newState = htmlToText(newState2);

       console.log("ppp  ", newState)

        let hasText = newState?.split(/\s+/).length>0 && newState !== "";
       
        const wordCount = newState?.split(/\s+/).length;
        setEditorState2(newState)
        console.log("summa  ", hasText,  wordCount)
        setTotalWords2(hasText ? wordCount : 0)

    }

    const htmlToText = (htmlString) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        return doc.body.textContent || '';
    };
    const summarise_Input = async () => {
        // Function to convert HTML to plain text


        // Convert editorState1 (HTML) to plain text
        let plainText = htmlToText(editorState1);
        if(!plainText){
            toast.warn("Please enter the text")
            return
        }

        let data = {
            "prompt": plainText // Use the plain text instead of HTML content
        };

        console.log("Converted Text: ", data);
       

        try {
            setLoading(true);
            const response = await axios.post(`https://text-pro.onrender.com/Summariser`, {
                data, // Pass the user's plain text prompt
            });

            console.log("Response: ", response);
            setSummariseText(response.data.result);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    const handleSliderChange = (event, newValue) => {
        // Calculate the percentage
        const percentage = ((newValue - 0) / (100 - 0)) * 100;
        // Update the state
        setSliderValue(newValue);
        setSliderText(newValue >= 60 ? "Expand" : "Shorten")
        summarizeByPercentage(newValue)
        // Use the percentage as needed
        console.log('Percentage:', percentage);
    };



    const summarizeByPercentage = async (percent) => {
        console.log("Percentage  ", percent)
        let plainText = htmlToText(editorState1);
console.log("editor val: ", editorState1)
console.log("PlainText ", plainText)

        const data = {
            percent,
            "prompt": plainText
        }

        try {
            setLoading(true)
            let response = await axios.post(`https://text-pro.onrender.com/SummariseByPersentage` , {data})
            console.log("OUTPUT", response.data.result)
            setSummariseText(response.data.result)
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setLoading(false)
        }
    }


    const handleDeleteClick = () => {
        setEditorState1("")
    }
    
    const handleDeleteClick2 = () => {
        setSummariseText("")
    }


    const handleCopyEditor = () => {
        let plainText = htmlToText(editor.current.value);

        if (editor.current) {
            // Get the HTML content from the editor
            const htmlContent = plainText; // Jodit editor HTML content
console.log("htmlContent ", htmlContent)
            if (!htmlContent.trim()) {
                toast.warn(`You don't have any content to copy`);
                return;
            }

            // Copy the HTML content to clipboard
            navigator.clipboard.writeText(htmlContent).then(
                () => {
                    toast.success("Editor content has been copied!");
                },
                (err) => {
                    console.error("Could not copy text: ", err);
                }
            );
        } else {
            console.error("Editor instance not found");
        }
    };
    

    const handleCopyEditor2 = () => {
        // Check if editorInstance is available
        let plainText = htmlToText(editor2.current.value);

        if (editor2.current) {
            // Get the HTML content from the editor
            const htmlContent = plainText; // Jodit editor HTML content
console.log("htmlContent ", htmlContent)
            if (!htmlContent.trim()) {
                toast.warn(`You don't have any content to copy`);
                return;
            }

            // Copy the HTML content to clipboard
            navigator.clipboard.writeText(htmlContent).then(
                () => {
                    toast.info("Editor content has been copied!");
                },
                (err) => {
                    console.error("Could not copy text: ", err);
                }
            );
        } else {
            console.error("Editor instance not found");
        }
    };
    const handleFileChange = (e) => {
        const file = e.target.files[0]; // Get the first selected file
        if (!file) return;

        // Validate file type and size
        if (file.type === "application/pdf") {
            toast.warn("PDF format is not supported.");
            return;
        }
        if (file.size > 4194304) { // 4 MB limit
            Swal.fire({
                title: 'Document exceeded the limit of 4 Mb!',
                icon: 'error',
                confirmButtonText: 'ok'
            });
            return;
        }

        const reader = new FileReader();

        // Handle .docx files
        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            reader.onload = function (event) {
                mammoth.convertToHtml({ arrayBuffer: event.target.result })
                    .then(function (result) {
                        const htmlContent = result.value;
                        // Set the HTML content into Jodit Editor
                        if (editor.current) {
                            editor.current.value = htmlContent; // Set editor's value
                        }
                    })
                    .catch(() => toast.error("Error processing the document"));
            };
            reader.readAsArrayBuffer(file);
        }
        // Handle .txt files
        else if (file.type === "text/plain") {
            reader.onload = function (event) {
                const plainText = event.target.result;
                // Set the plain text content into Jodit Editor
                if (editor.current) {
                    editor.current.value = plainText; // Set editor's value
                }
            };
            reader.readAsText(file);
        }
        // Unsupported file types
        else {
            toast.warn("Unsupported file type");
        }
    };


   

    
    const handleMicClick = () => {
        if (SpeechRecognition.browserSupportsSpeechRecognition()) {
            if (isRecording) {
                SpeechRecognition.stopListening();
                // handleSpeechInput(transcript); // Use the transcript when recording stops
            } else {
                SpeechRecognition.startListening({ continuous: true });
            }
            setIsRecording(!isRecording);
        } else {
            toast.error("Speech recognition is not supported by your browser.");
        }
    };

    const handleTranscriptChange = () => {
        // This function will be called whenever the transcript changes
        if (transcript) {
            handleSpeechInput(transcript);
        }
    };

    useEffect(() => {
        // Clean up speech recognition when component unmounts or when navigating away
        return () => {
            if (isRecording) {
                SpeechRecognition.stopListening();
                resetTranscript()
            }
        };
    }, [isRecording]);

    const handleSpeechInput = (input) => {
        let plainText = htmlToText(editorState1);

        const currentText = plainText;
        const newText = `${currentText} ${input}`;
     
        setEditorState1(newText);
    };
    useEffect(() => {
        handleTranscriptChange();
        if (transcript.length > 2) {
            resetTranscript()
        }
    }, [transcript]);


    const handleFileChange3 = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.type === "application/pdf") {
            // If the file is a PDF, show a toast message and return
            toast.warn("PDF format is not supported.");
            return;
        }
        if (file.size > 4194304) {
            Swal.fire({
                title: 'Document exceeded the limit of 4 Mb!',
                type: 'error',
                confirmButtonText: 'ok'
            })
        }

        if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            let reader = new FileReader();

            reader.onload = function (event) {
                mammoth.convertToHtml({ arrayBuffer: event.target.result })
                    .then(function (result) {
                        const contentState = result.value;
                        setEditorState1(contentState);
                    })
                    .done();
            }

            reader.readAsArrayBuffer(file);
        }
        else if (file.type === "text/plain") {
            let reader = new FileReader();

            reader.onload = function (event) {
                const contentState = event.target.result;
                setEditorState1(contentState);
            }

            reader.readAsText(file);
        }
        else {
            console.log("Unsupported file type");
        }
    }





const handleDownload = () => {
    let plainText = htmlToText(editor2.current.value);

    if (!editor2.current.value) {
        toast.warn(`You don't have text, to download`);
        return;
    }
    const blob = new Blob([plainText], { type: 'text/plain' });

    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'text_content.doc';
    anchor.click();
    URL.revokeObjectURL(anchor.href);
};

    return (
        <>
            {loading && <Loader />}


            <div className="container-fluid" style={{ backgroundColor: "#fff", width: "80vw", position: "absolute", right: "0", top: "1%" }}>
                <div className='row' style={{ height: '90px', display: "flex", justifyContent: "end", backgroundColor: "#fff" }}>

                    {windowWidth > 767 && (
                        <div className='col-md-6 p-0' style={{ backgroundColor: "white", borderRadius: '0px 10px 0px 0px' }}>
                            <div className='d-flex justify-content-center' style={{ padding: '20px 20px' }}>
                                <span className='p-2 mr-2'>Short</span>
                                <Box sx={{ width: "90%" }}>
                                    <Slider
                                        defaultValue={0}
                                        value={sliderValue}
                                        step={20}
                                        marks={sliderMarks}
                                        min={0}
                                        max={100}
                                        size='small'
                                        onChange={handleSliderChange}
                                        valueLabelDisplay="off"
                                    // disabled={!isVisible}
                                    />
                                </Box>
                                <span className='p-2 ml-2'>Long</span>
                            </div>
                        </div>
                    )}

                </div>
                <div className='row' style={{ backgroundColor: 'white', borderRadius: '0px 0px 8px 8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <div className='col-md-6 p-0 ' style={{ borderRight: '4px solid gray' }}>
                        <div onClick={focusEditor}

                            // className='row'
                            style={{
                                boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
                                padding: '20px 10px',
                                // borderRadius: '8px 0px 0px 0px',
                                background: 'white',
                                // minHeight: '270px',
                                // maxHeight: '270px',
                                height: "48vh",
                                overflowY: 'auto',
                                // borderRight: isVisible ? "4px solid gray" : "",
                                borderTop: '4px solid gray',
                                backgroundColor: "white",

                            }}
                        >
                            <Editor
                                config={config}
                                ref={editor}
                                className="editor1"
                                value={editorState1}
                                onChange={(e) => handleOnChange(e)}
                                onBlur={(newState) => setEditorState1(newState)}
                                style={{ backgroundColor: "#fff"}}

                                placeholder='Please enter your text'
                            />
                        </div>

                        <div className=""
                            style={{
                                // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                borderRadius: '0px 0px 0px 8px',
                                background: 'white',
                                padding: '0px 20px 20px 20px',
                                // borderRight: isVisible ? "4px solid gray": ""
                                // minHeight: '70px', maxHeight: '70px'
                            }}
                        >

                            {/* <div className='row'>
                                <div className='col-md-6'>
                                    {isVisible &&
                                        <div className='px-2 justify-content-start'>
                                            {totalWords} Words
                                        </div>}
                                </div>
                            </div> */}


                            <div className='row' style={{ padding: '15px 30px', display: 'flex', justifyContent: 'center' }}>

                                {isCustom && isVisible && (

                                    <div className='col-md-12' >

                                    </div>
                                )}


                                {isKeyword && isVisible && (
                                    <div className='col-md-12'>

                                    </div>
                                )}

                            </div>






                            <div className='container-fluid' style={{ width: "95%", padding: '13px 12px', borderRadius: '10px', boxShadow: '1px 1px 6px 0px' }}>
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
                                                <Button
                                                    style={{ border: "none", background: "transparent", minWidth: '20px', padding: '0px', color: 'blue' }}
                                                  onClick={handleCopyEditor}
                                                >
                                                    <ContentCopyIcon />
                                                </Button>
                                            </div>
                                            <div className='px-2'>
                                                <Button
                                                    style={{ border: "none", background: "transparent", color: isRecording ? 'red' : 'gray', minWidth: '20px', padding: '0px' }}
                                                onClick={handleMicClick}
                                                >
                                                    <MicIcon />
                                                </Button>
                                            </div>
                                            <div className='px-2'>
                                                <Button
                                                    style={{ border: "none", background: "transparent", color: 'indigo', minWidth: '20px', padding: '0px' }}
                                                    component="label"
                                                    htmlFor="summeriserFileInput"
                                                >
                                                    <UploadIcon />
                                                    <VisuallyHiddenInput
                                                    id="summeriserFileInput"
                                                    type="file"
                                                    key={inputKey}
                                                    onChange={handleFileChange3}
                                                />
                                                </Button>
                                            </div>
                                            <div className='px-2'>
                                                <Button
                                                    variant="contained"
                                                    disabled={isSummarize}
                                                    onClick={() => summarise_Input()}
                                                    style={{ fontSize: '10px' }}
                                                >
                                                    Summarize
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>




                        </div>
                    </div>

                    <div className='col-md-6 p-0' >

                        <div className=""
                            style={{
                                boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
                                // padding: '20px 5px',
                                // borderRadius: '0px 8px 8px 0px',
                                background: 'white',
                                height: "48vh",
                                borderTop: '4px solid gray'
                            }}
                        >


                            {/* <div className='mt-1'
                                onClick={focusEditor}
                                style={{
                                    boxShadow: '0 0px 0px rgba(0, 0, 0, 0.1)',
                                    padding: '18px 15px',
                                    borderRadius: '8px 8px 0px 0px',
                                    background: 'violet',
                                    height: "53vh",
                                    overflowY: 'auto'
                                }}

                            >

                                <Editor
                                    ref={editor}
                                    editorState={editorState2}
                                    onChange={handleEditorChange2}
                              

                                />

                            </div> */}
                            {windowWidth <= 767 && (
                                <div className='col-md-6 p-0' style={{ backgroundColor: 'white', borderRadius: '0px 10px 0px 0px' }}>
                                    <div className='d-flex justify-content-center' style={{ padding: '20px 20px' }}>
                                        <span className='p-2 mr-2'>Short</span>
                                        <Box sx={{ width: "90%" }}>
                                            <Slider
                                                defaultValue={0}
                                                value={sliderValue}
                                                step={20}
                                                marks={sliderMarks}
                                                min={0}
                                                max={100}
                                                size='small'
                                                //  onChange={handleSliderChange}
                                                valueLabelDisplay="off"
                                            />
                                        </Box>
                                        <span className='p-2 ml-2'>Long</span>
                                    </div>
                                </div>
                            )}

                            <div
                                className='mt-1'
                               // onClick={focusEditor}
                                style={editorContainerStyle}
                            >
                                <Editor
                                    config={config2}
                                    ref={editor2}
                                    value={summariseText}
                                    onChange={(e) => handleEditorChange2(e)}
                                    style={{
                                        width: '100%', // Ensure the editor takes full width inside the container
                                        minHeight: '100%', // Ensure the editor takes the full height
                                        boxSizing: 'border-box',
                                        backgroundColor: "#fff",
                                    }}
                                />
                            </div>





                            <div className=''
                                style={{


                                    borderRadius: '0px 0px 8px 0px',
                                    background: 'white',

                                }}
                            >

                              




                                    <div className='row align-items-center' style={{ backgroundColor: "white", padding: '6px 12px', margin: '15px auto', borderRadius: '10px', boxShadow: '1px 1px 6px 0px', position: windowWidth < 768 ? 'relative' : "absolute", bottom: '5px', left: windowWidth < 768 ? '0%' : "52%", width: '45%'}}>
                                        <div className='col-12 d-flex justify-content-between align-items-center' style={{ flexDirection: windowWidth < 390 ? 'column' : 'row', }}>
                                            <div className='d-flex'>
                                                <div className='p-2' style={{ fontWeight: "bold", color: "#1976d2", margin: "5px 0px", fontSize: '12px' }}>
                                                    {totalWords2 > 0 && `${totalWords2} Words`}
                                                </div>
                                                {isBulletPoints &&
                                                    <div className='p-2' style={{ fontWeight: "bold", color: "#1976d2", margin: "5px 0px", fontSize: '12px' }}>
                                                        {noOfBullets > 0 && `${noOfBullets} Points`}
                                                    </div>
                                                }
                                            </div>
                                            {/* <div className='d-flex justify-content-end flex-wrap' > */}
                                           
                                            <div style={{ display: "flex", }}>
                                                <div className='p-2'>
                                                    <button onClick={handleDeleteClick2} style={{ border: "none", background: "transparent", minWidth: '20px', padding: '0px', color: 'red' }} >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                                <div className='p-2'>
                                                    <button onClick={handleDownload} style={{ border: "none", background: "transparent", minWidth: '20px', padding: '0px', color: "green" }} >
                                                        <DownloadIcon />
                                                    </button>
                                                </div>
                                                <div className='p-2'>
                                                    <button onClick={handleCopyEditor2} style={{ border: "none", background: "transparent", minWidth: '20px', padding: '0px', color: "blue" }} >
                                                        <ContentCopyIcon />
                                                    </button>
                                                </div>
                                               
                                            </div>

                                            {/* </div> */}
                                        </div>
                                    </div>



                              

                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>
    )

}

export default Summariser;