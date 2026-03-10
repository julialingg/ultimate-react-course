import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Steps></Steps>
      </header>
    </div>
  );
}

function Steps() {
  const [step, setStep] = useState<number>(1)
  // 没用到isopen
  const [isOpen, setIsOpen] = useState<boolean>(false);

  function handlePrevious() {
    if (step > 1) {
      setStep((s) => s - 1)
    }
    setIsOpen((open) => (!open))

  }
  function handleNext() {
    if (step < 3) {
      setStep((s) => s + 1)
    }
    setIsOpen((open) => (!open))
  }

  function handleLearnHow() {
    alert("learn it")

  }
  return (
    <div className='steps'>

      <div className='stepNum' style={{ display: "flex", justifyContent: "space-between" }}>
        {/* <div className="step">1</div>
        <div className="step">2</div>
        <div className="step">3</div> */}
        <div className={step >= 1 ? "step" : ""}>1</div>
        <div className={step >= 2 ? "step" : ""}>2</div>
        <div className={step >= 3 ? "step" : ""}>3</div>
      </div>

      <div>
        <h1>Step {step}</h1>
        {step === 1 &&
          <div style={{ display: "flex", justifyContent: "center" }}>
            <p>Learn React</p>
            {/* 记住 img 怎么写 */}
            <img src={logo} className="img" alt="logo" />
          </div>}
        {step === 2 && <p>Apply Jobs</p>}
        {step === 3 && <p>Invest your new income</p>}


        <button onClick={handleLearnHow}> Learn How</button>
      </div>

      <div className='buttons' style={{ display: "flex", justifyContent: "space-between" }}>
        <button className='button' onClick={handlePrevious}>
          Previous
        </button>
        <button className='button' onClick={handleNext}>
          Next
        </button>
      </div>


    </div >
  )


}
export default App;
