
import React from "react";
import { Link } from "react-router-dom";
// import DescriptionIcon from '@mui/icons-material/Description';
import Button from '@mui/material/Button';
import { useNavigate  } from 'react-router-dom';
import Summariser from "../images/Summa.PNG";
import translator from "../images/Trans.PNG";
import GrammarCheckImg from "../images/GrammarCheck.PNG"
export default function LandingPage() {
    const navigate = useNavigate();


const navigateToSignUp = () => {
    navigate('/signup');

}






  return (
    <div className="d-flex flex-column min-vh-100">
  <header className="sticky-top bg-light">
    <div className="container d-flex align-items-center justify-content-between py-3 px-4">
      <a href="#" className="d-flex align-items-center gap-2">
        <span className="fs-4 fw-bold">TextPro</span>
      </a>
      <nav className="d-none d-md-flex gap-3">
        <a href="/signup" className="text-decoration-none fw-medium text-secondary">Sign-Up</a>
        <a href="/signin" className="text-decoration-none fw-medium text-secondary">Sign-In</a>
      
      </nav>
      <button onClick={navigateToSignUp} className="btn btn-primary">Try it now</button>
    </div>
  </header>
  <main className="flex-grow-1">
  <section className="py-5 bg-primary text-white">
  <div className="container d-flex flex-column align-items-center text-lg-start text-center">
    <div className="col-lg-8">
      <h1 className="display-4 fw-bold mb-3">Elevate your writing with TextPro</h1>
      <p className="lead mb-4">
        Unlock the power of advanced text-based tools to enhance your documents. From grammar check to translation, summarization to paraphrasing, TextPro has you covered.
      </p>
      <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center justify-content-lg-start">
        <button onClick={navigateToSignUp} className="btn btn-light btn-lg">Try it now</button>
        <a href="#" className="btn btn-outline-light btn-lg">Learn more</a>
      </div>
    </div>
  </div>
</section>



    <section className="py-5 bg-light">
      <div className="container row gap-3 gap-lg-0 align-items-center">
        <div className="col-lg-6">
          <h2 className="display-5 fw-bold">Powerful Translation</h2>
          <p className="lead text-muted">
            Break down language barriers with our accurate and contextual translation tool. Translate your documents to multiple languages with ease.
          </p>
          <a href="#" className="btn btn-primary">Try Translation</a>
        </div>
        <div className="col-lg-6">
          <img src={translator} className="img-fluid rounded" alt="Translation" />
        </div>
      </div>
    </section>
    <section className="py-5">
      <div className="container row gap-3 gap-lg-0 align-items-center">
        <div className="col-lg-6">
          <img src={Summariser} className="img-fluid rounded" alt="Summarization" />
        </div>
        <div className="col-lg-6">
          <h2 className="display-5 fw-bold">Concise Summarization</h2>
          <p className="lead text-muted">
            Quickly summarize long documents and articles with our powerful summarization tool. Get the key points without wasting time.
          </p>
          <a href="#" className="btn btn-primary">Try Summarization</a>
        </div>
      </div>
    </section>


    <section className="py-5 bg-light">
    <div className="container row gap-3 gap-lg-0 align-items-center">
      <div className="col-lg-6">
        <h2 className="display-5 fw-bold">Grammar Perfection</h2>
        <p className="lead text-muted">
          Identify and correct grammar mistakes effortlessly with our AI-powered Grammar Check tool. Improve your writing with instant corrections and suggestions.
        </p>
        <a href="#" className="btn btn-primary">Try Grammar Check</a>
      </div>
      <div className="col-lg-6">
        <img 
          src={GrammarCheckImg} 
          className="img-fluid rounded" 
          alt="Grammar Check" 
        />
      </div>
    </div>
  </section>
   
  </main>
  <footer className="bg-light py-4">
    <div className="container text-secondary">
      <div className="row">
        <div className="col-6 col-md-2">
          <h5>Company</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary">About Us</a></li>
            <li><a href="#" className="text-secondary">Our Team</a></li>
            <li><a href="#" className="text-secondary">Careers</a></li>
            <li><a href="#" className="text-secondary">News</a></li>
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h5>Products</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary">Grammar Check</a></li>
            <li><a href="#" className="text-secondary">Translation</a></li>
            <li><a href="#" className="text-secondary">Summarization</a></li>
            <li><a href="#" className="text-secondary">Paraphrasing</a></li>
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h5>Resources</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary">Blog</a></li>
            <li><a href="#" className="text-secondary">Documentation</a></li>
            <li><a href="#" className="text-secondary">Support</a></li>
            <li><a href="#" className="text-secondary">FAQs</a></li>
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h5>Legal</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary">Privacy Policy</a></li>
            <li><a href="#" className="text-secondary">Terms of Service</a></li>
            <li><a href="#" className="text-secondary">Cookie Policy</a></li>
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h5>Contact</h5>
          <ul className="list-unstyled">
            <li><a href="#" className="text-secondary">Support</a></li>
            <li><a href="#" className="text-secondary">Sales</a></li>
            <li><a href="#" className="text-secondary">Partnerships</a></li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</div>

  )
}

