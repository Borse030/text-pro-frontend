import React, { useState, useEffect, useRef } from "react";
import { Button, Container, Row, Col, Form } from "react-bootstrap";
import {
  Mic,
  Upload,
  CheckBox,
  Download,
  FileCopy,
  VolumeUp,
  Pause,
  PlayArrow,
} from "@mui/icons-material";
import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";

import {
  ContentState,
  Editor,
  EditorState,
  Modifier,
  RichUtils,
  SelectionState,
} from "draft-js";
import { Circle } from "@mui/icons-material";
import DownloadSharpIcon from "@mui/icons-material/DownloadSharp";
import { toast, ToastContainer } from "react-toastify";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import styled from "styled-components";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import axios from 'axios';
import Slider from "@mui/material/Slider";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from "./Loader";
const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});



const Translator = () => {
  const [loading, setLoading] = useState(false);

  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [showCount, setShowCount] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState("");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [nativeWord, setNativeWord] = useState("");

  const [secondaryeditorState, setSecondaryEditorState] = useState(
    EditorState.createEmpty()
  );
  const [wordsCount, setWordsCount] = useState(0);
  const [opWordsCount, setOpWordsCount] = useState(0);
  const [wordCheck, setWordCheck] = useState("");
  const [hasText, setHasText] = useState(false);
  const [interchangeClicked, setInterchangeClicked] = useState(false);
  const [dropdownValue, setDropdownValue] = useState("");

  const [languageList, setLanguageList] = useState([
    "Arabic",
    "Assamese",
    "Bengali",
    "Cebuano",
    "Chinese",
    "Czech",
    "Danish",
    "Dutch",
    "English",
    "Finnish",
    "French",
    "German",
    "Greek",
    "Gujarati",
    "Hebrew",
    "Hindi",
    "Hungarian",
    "Indonesian",
    "Italian",
    "Japanese",
    "Kannada",
    "Korean",
    "Malay",
    "Malayalam",
    "Marathi",
    "Nepali",
    "Norwegian",
    "Odia",
    "Persian",
    "Polish",
    "Portuguese",
    "Punjabi",
    "Romanian",
    "Russian",
    "Sanskrit",
    "Spanish",
    "Swedish",
    "Tagalog",
    "Tamil",
    "Telugu",
    "Thai",
    "Turkish",
    "Urdu",
    "Ukrainian",
    "Vietnamese"
  ]);
  const [selectedLanguage, setSelectedLanguage] = useState("");

  // useEffect(()=>{}
  //   alert(selectedLanguage)
  // },[selectedLanguage])

  const [industryList, setIndustryList] = useState([
    {
      value: "",
      name: "Select",
    },
    {
      value: "IT",
      name: "IT",
    },
    {
      value: "Healthcare",
      name: "Healthcare",
    },
    {
      value: "Finance",
      name: "Finance",
    },
    {
      value: "Agriculture",
      name: "Agriculture",
    },
    {
      value: "Education",
      name: "Education",
    },
    {
      value: "Retail",
      name: "Retail",
    },
    {
      value: "Telecommunication",
      name: "Telecommunication",
    },
  ]);
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [professionList, setProfessionList] = useState([
    {
      value: "",
      name: "Select",
    },
    {
      value: "Content Writer",
      name: "Content Writer",
    },
    {
      value: "Business Owner",
      name: "Business Owner",
    },
    {
      value: "HR Professional",
      name: "HR Professional",
    },
    {
      value: "Marketing",
      name: "Marketing",
    },
    {
      value: "Product Manager",
      name: "Product Manager",
    },
    {
      value: "Medical Professional",
      name: "Medical Professional",
    },
    {
      value: "Legal Professional",
      name: "Legal Professional",
    },
  ]);
  const [selectedProfession, setSelectedProfession] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);
  const [showPauseResumeToggle, setShowPauseResumeToggle] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentSpeed, setCurrentSpeed] = useState(speed);
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [speakLanguage, setSpeakLanguage] = useState("");
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const editorRef = useRef(null);



  // Function to focus on the editor when the editor div is clicked
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Clean up speech synthesis when component unmounts or when navigating away
    return () => {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      }
    };
  }, [isPlaying]);

  const handleListen = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const textToSpeak = secondaryeditorState
        .getCurrentContent()
        .getPlainText();
      const utterance = new SpeechSynthesisUtterance(textToSpeak);

      const voices = window.speechSynthesis.getVoices();
      console.log("Available Voices:", voices);

      const femaleVoices = voices.filter(
        (voice) =>
          voice.name.includes("Microsoft Zira - English (United States)") &&
          voice.lang.includes(speakLanguage.toLowerCase())
      );

      console.log("femaleVoices:", femaleVoices);

      if (femaleVoices.length > 0) {
        utterance.voice = femaleVoices[0];
      } else {
        console.warn("Female voice not found");
      }

      utterance.lang = speakLanguage;
      utterance.rate = currentSpeed;

      utterance.onend = () => {
        console.log("Speech synthesis completed");
        setIsPlaying(false);
        setShowPauseResumeToggle(false);
      };

      if (!isPlaying) {
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
        setShowPauseResumeToggle(true);
      } else {
        window.speechSynthesis.pause();
        setIsPlaying(false);
        setShowPauseResumeToggle(false);
      }
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  const handleSpeedChange = (_, newValue) => {
    if (!isSliderMoving) {
      setSpeed(newValue);
      setCurrentSpeed(newValue);

      if (isPlaying) {
        const textToSpeak = secondaryeditorState
          .getCurrentContent()
          .getPlainText();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);

        const voices = window.speechSynthesis.getVoices();

        const femaleVoices = voices.filter(
          (voice) =>
            voice.name.includes("Microsoft Zira - English (United States)") &&
            voice.lang.includes(speakLanguage.toLowerCase())
        );

        if (femaleVoices.length > 0) {
          utterance.voice = femaleVoices[0];
        } else {
          console.warn("Female voice not found. Using default voice.");
        }

        utterance.lang = speakLanguage;
        utterance.rate = newValue;

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.pause();
    } else {
      window.speechSynthesis.resume();
    }
    setIsPlaying(!isPlaying);
  };
  const clearListenFunctionality = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setShowPauseResumeToggle(false);
  };

  const handleOuputChange = (newEditorState) => {
    const contentState = newEditorState.getCurrentContent();
    setSecondaryEditorState(newEditorState);

    if (contentState.hasText() === false) {
      clearListenFunctionality();
    }
  };




  const handleInput = (e) => {
    let value = e.target.value;
    if (value == "") {
      setDetectedLanguage("");
    }
    setInputText(e.target.value);
  };

  useEffect(() => {
    console.log("Detector_", inputText, wordCheck);
    if (inputText !== "" && wordCheck !== "") {
      //  handleDetect();
    }
  }, [wordCheck]);

  const handleEditorChange = (newEditorState) => {
    setEditorState(newEditorState);

    const plainTextContent = newEditorState.getCurrentContent().getPlainText();
    setInputText(plainTextContent);

    if (plainTextContent === "") {
      setDetectedLanguage("");
      setSelectedIndustry("");
      setSelectedProfession("");
      setWordsCount(0);
      setOpWordsCount(0);
      setHasText(false);
    } else {
      setHasText(true);
    }

    if (plainTextContent !== "") {
      const trimmedText = plainTextContent.trim();
      const words = trimmedText
        .split(/\s+/)
        .filter((word) => word !== "").length;
      let splitinput = plainTextContent.split(" ");
      if (splitinput.length > 1) {
        setWordCheck(splitinput[0]);
      }
      console.log("words_", words);
      setWordsCount(words);
    }
  };


  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    console.log("editorstate_", newState);
    if (newState) {
      handleEditorChange(newState);
      return "handled";
    }
    return "not-handled";
  };

  const handlecopy = () => {
    // console.log('editorRight', editorRight);
    let text = secondaryeditorState.getCurrentContent().getPlainText();
    if (text == "") {
      toast.warn(`You don't have text, to copy`);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log("Async: Copying to clipboard was successful!");
        if (text) toast.info("Your text Copied!");
      },
      function (err) {
        console.error("Async: Could not copy text: ", err);
      }
    );
  };

  const handleDownload = () => {
    // const contentState = outputSentence;
    // const rawText = outputSentence
    // const textToDownload = rawText.blocks.map(block => block.text).join('\n');
    if (secondaryeditorState.getCurrentContent().getPlainText() == "") {
      toast.warn(`You don't have text, to download`);
      return;
    }
    const blob = new Blob(
      [secondaryeditorState.getCurrentContent().getPlainText()],
      { type: "text/plain" }
    );

    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "text_content.doc";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };



  const handleLanguage = (event, value) => {
   
    console.log("e_", event);

    console.log("V_", value.props.value);
    if (value?.value !== selectedLanguage) {
      setSecondaryEditorState(EditorState.createEmpty());
      clearListenFunctionality();
    }
    // setSelectedLanguage(value !== undefined ? value.value : event[0]);
    setSelectedLanguage(value.props.value);
  };

  const handleFileChange = (e) => {
    console.log("files_", e);
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const content = event.target.result;
        const text = content.toString();

        const contentState = ContentState.createFromText(text);
        const newEditorState = EditorState.createWithContent(contentState);

        setEditorState(newEditorState);
      };

      reader.readAsText(file);
    }
  };

  const handleDelete = () => {
    setEditorState(EditorState.createEmpty());
    setSecondaryEditorState(EditorState.createEmpty());
    setInputText("");
    setTranslatedText("");
    setDetectedLanguage("");
    setSelectedIndustry("");
    setSelectedProfession("");
    setSelectedLanguage("");
    setWordsCount(0);
    setOpWordsCount(0);
    setWordCheck("");
    setHasText(false);
    clearListenFunctionality();
  };

  const handleInterchange = () => {

    if (!secondaryeditorState.getCurrentContent().hasText()) {
      return;
    }
    const temp = detectedLanguage;
    console.log("temp_", temp);
    setDetectedLanguage(selectedLanguage);
    setSelectedLanguage(temp)

    const tempText = inputText;
    setInputText(translatedText);
    setTranslatedText(tempText);

    const tempEditorState = editorState;
    console.log("editor_", tempEditorState, secondaryeditorState);
    setEditorState(secondaryeditorState);
    setSecondaryEditorState(tempEditorState);

    const firstEditor = secondaryeditorState.getCurrentContent().getPlainText();
    const secondEditor = tempEditorState.getCurrentContent().getPlainText();
    handleWordsCount(firstEditor, "first");
    handleWordsCount(secondEditor, "second");

    setDropdownValue(selectedLanguage);
  };

  const handleWordsCount = (text, type) => {
    const trimmedText = text.trim();
    const words = trimmedText.split(/\s+/).filter((word) => word !== "").length;
    console.log("words_", words);
    if (type == "first") {
      setWordsCount(words);
    } else {
      setOpWordsCount(words);
    }
  };

  useEffect(() => {
    //the dropdown value after selectedLanguage changes
    console.log("selectedLang_", selectedLanguage);
    setDropdownValue(selectedLanguage);
  }, [selectedLanguage]);

  useEffect(() => {
    console.log("Detector_", inputText, wordCheck);
    if (inputText !== "" && wordCheck !== "") {
      detectLanguage();
    }
  }, [wordCheck]);

  const detectLanguage = async () => {

    if (inputText === "") {
      return;
    }
    
    try {
      const body = {
        data: {
          text: inputText,
        },
      };


      const response = await axios.post(`https://text-pro.onrender.com/detectLanguage`, body, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("detected lang   ", response.data.result);
      const language= response.data.result.split(' ').slice(0, 2).join(' ')

      setDetectedLanguage(language)
    } catch (err) {
      console.error('Error detecting language:', err);
      toast.error(err)
    }
  };



  const handleTranslate = async () => {
    if (
      editorState.getCurrentContent().getPlainText().trim().split(/\s+/)
        .length > 1500
    ) {
      toast.warn("Words limit exceeded");
      return;
    }

    setLoading(true);
    try {
      let input = editorState.getCurrentContent().getPlainText();
      if (input === "") {
        toast.warn("Please enter text to translate");
        setLoading(false);
        return;
      }
      if (selectedLanguage == "") {
        toast.warn("Please Select the Language to translate");
        setLoading(false);
        return;
      }

      console.log(
        "SelectedLang_",
        selectedLanguage,
        selectedIndustry,
        selectedProfession
      );

      let data;
      if (selectedProfession !== "" && selectedIndustry !== "") {
        data = {
          selectedLanguage,
          selectedIndustry,
          selectedProfession,
          input,
        };
      } else if (selectedProfession !== "") {
        data = {
          selectedLanguage,
          selectedProfession,
          input,
        };
      } else if (selectedIndustry !== "") {
        data = {
          selectedLanguage,
          selectedIndustry,
          input
        };
      } else {
        data = {
          selectedLanguage,
          input,
         
        };
      }

      const response = await axios.post(`https://text-pro.onrender.com/checkTranslator` , {data}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const translatedText = response?.data?.result;
      console.log("translatedText", translatedText);

      if (response.status == 500) {
        toast.warn(response.message);
        return;
      }
      let textWithoutLeadingNewlines = translatedText.replace(/^\n+/, "");
      let wordLength = translatedText.split(/[ -]+/);

      setOpWordsCount(wordLength.length);
      const contentState = ContentState.createFromText(
        textWithoutLeadingNewlines
      );
      const newEditorState = EditorState.createWithContent(contentState);
      setTranslatedText(translatedText);
      setSecondaryEditorState(newEditorState);
      setLoading(false);
    } catch (error) {
      console.error("Error calling backend API:", error.message);
      toast.warn(error.message);
      setLoading(false);
    }
  };








  return (
    <div style={{ backgroundColor: "white", width: "80%", position: "absolute", right: "1%" }}>
    {loading && <Loader />}

      <div className=" mt-4 px-1" >
        <div
          className="col-12 d-flex p-0"
          style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap", // Ensure items wrap if they overflow
            alignItems: "center", // Center items vertically
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: windowWidth > 767 ? "0px" : "7px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: windowWidth > 767 ? "130px" : "49%",
              }}
            >
              {detectedLanguage == "" ? (
                <Button
                  variant="light"
                  disabled={true}
                  style={{
                    borderColor: "#1976D2",
                    color: "#1976D2",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    width: "100%",
                    transition: "box-shadow 0.3s",
                    fontSize: "14px",
                  }}
                >
                  Detect Language
                </Button>
              ) : (
                <Button
                  variant="light"
                  className="mr-2"
                  disabled={true}
                  style={{
                    borderColor: "#1976D2",
                    color: "#1976D2",
                    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
                    transition: "box-shadow 0.3s",
                    fontSize: "14px",
                    width: windowWidth > 767 ? "130px" : "100%",
                  }}
                >
                  {detectedLanguage}
                </Button>
              )}
            </div>
            <div
              className="ml-2"
              style={{
                width: windowWidth > 767 ? "150px" : "49%",
                color: "blue",
              }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Profession</InputLabel>
                <Select
                  value={selectedProfession}
                  onChange={(e) => setSelectedProfession(e.target.value)}
                  label="Select Profession"
                >
                  {professionList.map((profession, index) => (
                    <MenuItem key={index} value={profession.value}>
                      {profession.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              marginBottom: windowWidth > 767 ? "0px" : "7px",
              marginRight: windowWidth > 767 ? "20px" : "0px",
            }}
          >
            <div
              className={`ml-mb-2 bg-white ${windowWidth > 768 ? "ml-2" : ""
                }`}
              style={{ width: windowWidth > 767 ? "135px" : "49%" }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Select Industry</InputLabel>
                <Select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  label="Select Industry"
                >
                  {industryList.map((industry, index) => (
                    <MenuItem key={index} value={industry.value}>
                      {industry.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div
              onClick={handleInterchange}
              style={{
                color: "#1976D2",
                boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.1)",
                width: windowWidth > 767 ? "62px" : "49%",
                marginLeft: "15px",
                height: "32px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                backgroundColor: "white",
              }}
            >
              <SwapHorizIcon
                style={{
                  color: "#1976D2",
                  cursor: "pointer",
                  fontSize: "30px",
                }}
              />
            </div>
          </div>

          <div
            className="bg-white"
            style={{
              width: windowWidth > 1076 ? "200px" : windowWidth > 767 ? "130px" : "100%",
            }}
          >
            <FormControl fullWidth variant="outlined">
              <InputLabel>Select Language</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={handleLanguage}
                label="Select Language"
                id="languageDropdown"
              >
                {languageList.map((language, index) => (
                  <MenuItem key={index} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>



        <div className="row mt-2 ">
          <div className="col-md-6 mb-3 mb-md-0">
            <div
              className="editor  ft_md"
              style={{
                paddingRight: "42px",
                paddingLeft: "40px",
                paddingTop: "40px",
                minHeight: "60vh",
                maxHeight: "60vh",
                overflowY: "auto",
                borderRadius: "8px",
                paddingBottom: "100px",
                boxShadow: "2px 2px 5px -2px #000000",
              }}
            >


              <Editor
                onChange={handleEditorChange}
                editorState={editorState}
                autoCapitalize="sentences"
                placeholder="Start Writing..."
                onClick={focusEditor}

              />
            </div>
            <div
              className={`text-e d-flex mt-3 justify-content-between bottomeditor`}
              style={{ boxShadow: "2px 2px 5px -2px #000000", height: "52px" }}
            >
              <div>
                <p className="ft_sm mt-1 d-flex" style={{ alignItems: "center" }}>
                  <Circle
                    style={{ height: "12px", width: "13px", color: "#3295F7" }}
                  />
                  <div
                    className="ml-2"
                    style={{
                      color: "#5F5F5F",
                      fontSize: "16px",
                      fontWeight: "400px",
                      color: "#3295F7",
                    }}
                  >
                    <b>{wordsCount}/1500 Words</b>
                  </div>
                </p>
              </div>

              <div style={{ width: "150px", height: "35px", display: "flex", justifyContent: "space-evenly" }}>
                {hasText && (
                  <div
                    className="delete-icon"
                    // title={"Delete"}
                    onClick={() => handleDelete()}
                  >
                    <DeleteIcon
                      size={"20px"}
                      style={{
                        color: "red",
                        cursor: "pointer",
                        position: "relative",
                        top: "5px",
                        // right: "30px",
                      }}
                    />

                  </div>
                )}
                <Button
                  variant="primary"
                  className=""
                  style={{ borderRadius: "8px", marginRight: "10px" }}
                   onClick={handleTranslate}
                  disabled={editorState !== "" ? false : true}
                >
                  Translate
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="editor ft_md w-100"
              style={{
                paddingRight: "5%",
                minHeight: "60vh",
                maxHeight: "60vh",
                overflowY: "auto",
                borderRadius: "8px",
                paddingBottom: "100px",
                boxShadow: "2px 2px 5px -2px #000000",
              }}
            >
              <Editor
                editorState={secondaryeditorState}
                onChange={handleOuputChange}
                readOnly={true}
            
              />
            </div>
            <div
              className={`text-e d-flex mt-3 justify-content-between bottomeditor`}
              style={{ boxShadow: "2px 2px 5px -2px #000000", height: "52px" }}
            >
              <div>
                <p className="ft_sm mt-1 d-flex" style={{ alignItems: "center" }}>
                  <Circle
                    style={{ height: "12px", width: "13px", color: "#3295F7" }}
                  />
                  <div
                    className="ml-2"
                    style={{
                      color: "#5F5F5F",
                      fontSize: "16px",
                      fontWeight: "400px",
                      color: "#3295F7",
                    }}
                  >
                    <b>{opWordsCount}/1500 Words</b>
                  </div>
                </p>
              </div>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className={`px-2`}
                    onClick={handleDownload}
                    style={{ border:"none", backgroundColor:"white"}}
                  >
                    <DownloadSharpIcon
                      size={"20px"}
                      style={{ color: "green" }}
                    />
                  </button>
                  <button
                    className={`px-2`}
                    onClick={handlecopy}
                    style={{ border:"none", backgroundColor:"white"}}

                  >
                    <ContentCopyIcon
                      size={"20px"}
                      data-toggle="tooltip"
                      data-placement="top"
                      title={"Copy to clipboard"}
                      style={{ color: "blue" }}
                    />
                  </button>
                  <button
                    className={`px-2`}
                    onClick={handleListen}
                  // title={"Listen"}
                  style={{ border:"none", backgroundColor:"white"}}

                  >
                    <VolumeUp size={"20px"} style={{ color: "brown" }} />
                  </button>
                  {showPauseResumeToggle && (
                    <>
                      <button
                        className={`px-2`}
                        onClick={handleTogglePlay}
                        title={isPlaying ? "Pause" : "Resume"}
                      >
                        {isPlaying ? (
                          <Pause size={"20px"} style={{ color: "#7C7C7C" }} />
                        ) : (
                          <PlayArrow size={"20px"} style={{ color: "#7C7C7C" }} />
                        )}
                      </button>
                      <Slider
                        title={"Playback Speed"}
                        value={speed}
                        marks
                        min={0.25}
                        max={2}
                        step={0.25}
                        onChange={(_, newValue) => handleSpeedChange(_, newValue)}
                        onDragStart={() => setIsSliderMoving(true)}
                        onDragEnd={() => setIsSliderMoving(false)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value}x`}
                        getAriaValueText={(value) => `${value}x`}
                        style={{ width: "100px" }}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
