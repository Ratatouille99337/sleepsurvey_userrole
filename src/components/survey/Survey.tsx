import './Survey.scss';
import img1 from './html/img/main_icon_1.svg';
import jsonData from './survey.json';
import { BiCheckDouble } from "react-icons/bi";
import './html/css/bootstrap.min.css';
import './html/css/style.scss';
import './html/css/vendors.css';
import './html/css/custom.css';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
// import axios from 'axios';
import { useState, useEffect } from 'react';
import SurveyGroup from './tabs/SurveyGroup';
import { devApiLink } from "./config";
// import emailjs from 'emailjs-com';

interface ContentItem {
  id: number;
  heading: string;
  dataType: 'verticalRadio' | 'verticalCheckBox' | 'inputSmallNumber' | 'inputSmallText' | 'inputTextArea';
  dataTitle: string;
  dataSubTitle?: string; // Assuming this can also be optional
  required: boolean;
  dataContent: string[];
  requiredTrueValue?: string;
  lowerLimit?: string;
  upperLimit?: string;
  additionalData?: any;
  mark: number[];
}

interface Survey {
  id: number;
  title: string;
  availableLength: number;
  backImg : string;
  content: ContentItem[];
}

type Surveys = Survey[];

interface SurveyPagesProps {}

export default function SurveyPages({}: SurveyPagesProps) {
  const [pageStatus, setPageStatus] = useState<number>(0);
  const [surveyData, setSurveyData] = useState<Surveys>([]);
  const [answerNumber, setAnswerNumber] = useState<number[]>(Array(surveyData.length).fill(0));
  const [answerContent, setAnswerContent] = useState<any[]>([]);
  const [totalErrors, setTotalErrors] = useState<string[]>([]);
  const [maxSectionReached, setMaxSectionReached] = useState<number>(0);

  const [modalShowStatus, setModalShowStatus] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<boolean>(false);

  // if roommate died, then move to next and next page

  useEffect(() => {
      console.log('answerContent', answerContent)
  }, [answerContent])

  const [roommateStatus, setRoommateStatus] = useState<boolean>(true);

  const markingSymbol = [
    [],
    [
      {
        milestone : 8,
        message : "It is unlikely that you are abnormally sleepy."
      },
      {
        milestone : 10,
        message : "You have an average amount of daytime sleepiness"
      },
      {
        milestone : 16,
        message : "You may be excessively sleepy depending on the situation. You may want to consider seeking medical attention"
      },
      {
        milestone : 25,
        message : "You are excessively sleepy and should consider seeking medical attention"
      },
    ],
    [
      {
        milestone : 6,
        message : "It is unlikely that you are abnormally sleepy."
      },
      {
        milestone : 12,
        message : "You have an average amount of daytime sleepiness"
      },
      {
        milestone : 16,
        message : "You may be excessively sleepy depending on the situation. You may want to consider seeking medical attention"
      },
      {
        milestone : 22,
        message : "You are excessively sleepy and should consider seeking medical attention"
      },
    ],
    [

    ],
    [
      {
        milestone : 2,
        message : "It is unlikely that you are abnormally sleepy."
      },
      {
        milestone : 5,
        message : "You have an average amount of daytime sleepiness"
      },
      {
        milestone : 8,
        message : "You may be excessively sleepy depending on the situation. You may want to consider seeking medical attention"
      },
      {
        milestone : 11,
        message : "You are excessively sleepy and should consider seeking medical attention"
      },
    ],
    [
      {
        milestone : 14,
        message : "low stress"
      },
      {
        milestone : 27,
        message : "moderate stress"
      },
      {
        milestone : 41,
        message : "high perceived stress"
      }
    ],
    [
      {
        milestone : 31,
        message : "definitely evening type"
      },
      {
        milestone : 42,
        message : "moderately evening type"
      },
      {
        milestone : 59,
        message : "neither type"
      },
      {
        milestone : 70,
        message : "moderately morning type"
      },
      {
        milestone : 87,
        message : "definitely morning type"
      }
    ],
    [
      {
        milestone : 3,
        message : "Low risk for moderate to severe OSA"
      },
      {
        milestone : 5,
        message : "Intermediate risk for moderate to severe OSA"
      },
      {
        milestone : 9,
        message : "High risk for moderate to severe OSA"
      }
    ]
  ]


  // json data import or backend data receive

  useEffect(() => {
    setSurveyData(jsonData as Surveys);
    setAnswerNumber(Array(jsonData.length).fill(0));
  }, []);

  // when page is move, then scroll to top

  useEffect(() => {
    document.getElementsByClassName('container_centering')[0].scrollTo(0, 0);
    setMaxSectionReached((prevMax) => Math.max(prevMax, pageStatus));
  }, [pageStatus]);

  useEffect(() => {
    setAnswerContent(Array.from({ length: surveyData.length }, () => []));
  }, [surveyData.length]);

  useEffect(() => {
  // Ensure jsonData is not null or undefined
  if (jsonData && Array.isArray(jsonData)) {
    setSurveyData(jsonData as Surveys);
    setAnswerNumber(Array(jsonData.length).fill(0));
  }
}, []);
  const prevBtnFunction = () => {
    setPageStatus(prev => Math.max(0, prev - 1)); // Prevent negative page status
  };

  const pageDotClasses = (index: number) => {
    const baseClass = `pageDot ${maxSectionReached >= index ? 'pageDotactive' : ''}`;
    return `${baseClass} ${maxSectionReached >= index ? 'pageDotGreen' : ''}`;
  };
  

  // store all answers of question

  const handleSetAnswerContent = (newValue: any, currentPageIndex: number, currentIndex: number, dataType: string) => {

    const pageItem = [...answerContent];

    const previousValue = pageItem[currentPageIndex]?.[currentIndex];

    if ( dataType === "verticalRadio" || dataType === "inputSmallText" || dataType === "inputSmallNumber" || dataType === "inputTextArea"){

      if(previousValue !== newValue) {
        if(previousValue === undefined){
          setAnswerNumber(prev => {
            const updatedAnswerNumber = [...prev];
            updatedAnswerNumber[currentPageIndex] = (updatedAnswerNumber[currentPageIndex] || 0) + 1;
            return updatedAnswerNumber;
          })
        }

        if (pageItem[currentPageIndex]) {
          pageItem[currentPageIndex] = [...pageItem[currentPageIndex]];
          pageItem[currentPageIndex][currentIndex] = newValue;
          setAnswerContent(pageItem);
        }
      }

    }
    else if (dataType === "verticalCheckBox"){

      const hasIncreasedCount = previousValue !== undefined && previousValue !== '';

      const itemIndex = parseInt(newValue);

      const existingValue = pageItem[currentPageIndex]?.[currentIndex] || '';

      const currentValues = existingValue.split(',').map((val:string) => val.trim()).filter((val:string) => val);

      if(!currentValues.includes(itemIndex.toString())){

        if (!hasIncreasedCount) {
          setAnswerNumber(prev => {
              const updatedAnswerNumber = [...prev];
              updatedAnswerNumber[currentPageIndex] = (updatedAnswerNumber[currentPageIndex] || 0) + 1;
              return updatedAnswerNumber;
          });
        }
        currentValues.push(itemIndex.toString());

      }
      else {
        const indexToRemove = currentValues.indexOf(itemIndex.toString());
        if(indexToRemove !== -1){
          currentValues.splice(indexToRemove, 1);
        }
      }

      const updatedValue = currentValues.join(',');

      if(pageItem[currentPageIndex]) {
        pageItem[currentPageIndex] = [...pageItem[currentPageIndex]];
        pageItem[currentPageIndex][currentIndex] = updatedValue;
        setAnswerContent(pageItem);
      }
      
      if(currentValues.length === 0){
        setAnswerNumber(prev => {
          const updatedAnswerNumber = [...prev];
          updatedAnswerNumber[currentPageIndex] = Math.max((updatedAnswerNumber[currentPageIndex] || 1) - 1, 0);
          return updatedAnswerNumber;
      });
      }
    }
  };

////Email id : naplytics@gmail.com , password : Nap@1234Email id : naplytics@gmail.com , password : Nap@12

  // when next button clicked

  const nextBtnFunction = () => {
    const basicData = surveyData[pageStatus];
    const inputData = answerContent[pageStatus];

    const middelData = surveyData[pageStatus].content;
  
    // Create an array with default "wbtOk" values with appropriate length
    const tempErrors = new Array(middelData.length).fill("wbtOk"); 
    let hasError = false; // To track if there are errors
  
    basicData.content.forEach((item, index) => {
      const value = inputData[index];
  
      if (item.required) {
        if (item.dataType === "inputSmallText") {
          if (!value || value === "") {
            tempErrors[index] = `${item.dataTitle} is required.`;
            hasError = true;
          }
          else if(item.dataTitle === "Please let me know your address"){
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
            if (!emailRegex.test(value)) {
              tempErrors[index] = `Please provide a valid email address.`;
              hasError = true;
            }
          }
        } 
        if (item.dataType === "verticalRadio") {
          if (!value || value === "") {
            tempErrors[index] = `${item.dataTitle} is required.`;
            hasError = true;
          }
          else if (item.dataTitle === "Do you consent to provide information?") {
            if (value === "No" || value === "") {
              tempErrors[index] = `You must consent to provide information to proceed.`;
              hasError = true;
            }
          }
          else if (item.dataTitle === "Do you have a bed partner or roommate?"){
            if(value === "Not during the past month"){
              setRoommateStatus(false)
            }
          }
        } 
        else if (item.dataType === "verticalCheckBox") {
          if (!value || value === "") {
            tempErrors[index] = `${item.dataTitle} is required.`;
            hasError = true;
          } else {
            const selectedValues = value.split(',').map((val:string) => val.trim()).filter(Boolean);
            if (selectedValues.length === 0) {
              tempErrors[index] = `${item.dataTitle} is required.`;
              hasError = true;
            }
          }
        } 
        else if (item.dataType === "inputSmallNumber") {
          const numberValue = Number(value);
          if (!value || value === "") {
            tempErrors[index] = `${item.dataTitle} is required.`;
            hasError = true;
          } else if (isNaN(numberValue) || numberValue < item?.additionalData?.minValue || numberValue > item?.additionalData?.maxVal) {
            tempErrors[index] = `You must be between ${item?.additionalData?.minValue} and ${item?.additionalData?.maxVal}.`;
            hasError = true;
          }
        }
      }
    });
  
    // If no errors, the totalErrors should remain "wbtOk"
    if (hasError) {
      console.log("Validation Errors: ", tempErrors);
    } else {
      console.log("No validation errors.");
    }
  
    // Set the totalErrors state
    setTotalErrors(tempErrors);
  
    // If no errors were found, proceed to the next page
    if (!hasError) {
      if(pageStatus === 0){
        setPageStatus(pageStatus + 1);
      }
      else {
        // scoring function start
        scoringFunction(basicData, inputData, pageStatus);
        // and modal show
        setModalShowStatus(true);
      }
    }
  };

  const [scoreNumber, setScoreNumber] = useState<number>(0);
  const [scoreMessage, setScoreMessage] = useState<string>("");
  

  const scoringFunction = (basicData: Survey, inputData: any, currentPageIndex: number) => {
    let score: number = 0;
    let message: string = "";
  
    if (currentPageIndex === 2) {
      // Special 2nd page scoring logic
  
      let tempArray: number[] = [];
  
      basicData.content.forEach((item: any, index: number) => {
        tempArray.push(item.mark[item.dataContent.indexOf(inputData[index])]);
      });
  
      score += tempArray[18];
      score += Math.ceil((tempArray[2] + tempArray[5]) / 2);
      score += (8 - tempArray[4]);
  
      let temp3: number = (tempArray[4] * 100) / (tempArray[3] - tempArray[1]);
  
      if (temp3 > 75 && temp3 < 85) {
        score += 1;
      } else if (temp3 > 65 && temp3 < 75) {
        score += 2;
      } else if (temp3 < 65) {
        score += 3;
      }
  
      let temp4: number = 0;
      for (let i = 0; i < 9; i++) {
        temp4 += tempArray[6 + i];
      }
      score += Math.ceil(temp4 / 9);
  
      score += tempArray[15];
  
      score += Math.ceil((tempArray[16] + tempArray[17]) / 2);
    } else {
      // Other pages scoring logic
      basicData.content.forEach((itemDummy: ContentItem, itemDummyIndex: number) => {
        const userAnswer = inputData[itemDummyIndex];
  
        if (itemDummy.mark && itemDummy.mark.length > 0) {
          itemDummy.dataContent.forEach((answer: string, answerIndex: number) => {
            if (answer === userAnswer) {
              score += itemDummy.mark[answerIndex];
            }
          });
        }
      });
  
      if (markingSymbol[currentPageIndex] && markingSymbol[currentPageIndex].length > 0) {
        // Ensure it breaks/lookups on first valid message match
        markingSymbol[currentPageIndex].some((data: any) => {
          if (score <= data.milestone) {
            message = data.message;
            return true; // Breaks the loop
          }
          return false;
        });
      }
    }
  
    setScoreNumber(score);
    setScoreMessage(message);
  
    // Update answerContent with score and message
    const updatedAnswerContent = [...answerContent];
  updatedAnswerContent[currentPageIndex] = { ...inputData, score, message };
  setAnswerContent(updatedAnswerContent);
  
    return;
  };


  const submitFunction = () => {
    setSubmitStatus(true);
    nextBtnFunction();
  };

  interface DisplayContentProps {
    basicData: string[];
    answerData: string;
  }

  const DisplayContent = ({basicData, answerData}:DisplayContentProps) => {
    //console.log(answerData);
    if(answerData){
      const answerSplitData = answerData.split(",");  
      return (
        basicData.map((item, index) => {
          if(answerSplitData.includes(index.toString())){
            return (
              <p key={index} className='content'>{item}</p>
            )
          }
        })
      );
    }
    else {
      return (
        <p className='content'>There is No Data</p>
      )
    }
    
  };

  const handleUltimateData = async () => {
    const surveyResponse = {
      // surveyId: pageStatus,
      responses: answerContent,
      // score: scoreNumber,
      // scoreMessage: scoreMessage,
    };
  
    try {
      // Await the axios post call and directly use the response
      const response = await axios.post(`${devApiLink}/survey/create`, surveyResponse);
  
      // Axios automatically parses the response body as JSON if it's a JSON response
      if (response.data.status) {
        alert('Congratulations! Successfully Submitted!');
       // window.location.href = "/";
      } else {
        alert("There is a problem in homepage");
      }
    //  window.location.href = "/"; // Optionally redirect or reset state
    } catch (error) {
      console.error("Error:", error);
      alert('There was an error submitting your survey. Please try again.');
    }
  };


  const calculateCurrentPageProgress = () => {
    if (surveyData[pageStatus]) {
      const totalAnsweredOnPage = answerNumber[pageStatus] || 0;
      const totalQuestionsOnPage = surveyData[pageStatus].availableLength;
      return { totalAnsweredOnPage, totalQuestionsOnPage };
    }
    return { totalAnsweredOnPage: 0, totalQuestionsOnPage: 0 };
  };
  return (
    <div className='mySurvey'>
      <div className='style_2'>
        <div className="container_centering">
          <div className="container" style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
            <div className="row justify-content-end" style={{ width: '100vw' }}>
              <div className="col-xl-6 col-lg-6 d-flex align-items-center flex-wrap surveyAdd">
                <div className="pageDots">
                  <div className='pageBar'></div>
                  {surveyData.map((_, index) => (
                    <span 
                      key={index} 
                      className={pageDotClasses(index)}
                      onClick={() => {
                        if (index <= maxSectionReached) {
                          setPageStatus(index);
                        }
                      }}
                    >
                      <BiCheckDouble />
                    </span>
                  ))}
                </div>
                <div className="main_title_1">
                  <h3><img src={img1} width="80" height="80" alt="" /> Survey</h3>
                  <p>Our recent survey reveals diverse sleep patterns and factors affecting quality rest.</p>
                  <button>Sending Email.</button>
                  <div className='text-center'>
                    <img src={surveyData?.[pageStatus]?.backImg || ""} width="auto" height="350px" alt="" />
                  </div>
                </div>
                <div className="progressBarContainer">
                  <div className="progressBar" style={{ width: `${(answerNumber[pageStatus] || 0) / (surveyData[pageStatus]?.availableLength || 6) * 100}%` }}>
                    <div className="numberPanel">
                      {`${calculateCurrentPageProgress().totalAnsweredOnPage} of ${calculateCurrentPageProgress().totalQuestionsOnPage || 6}`}
                      
                      {answerNumber[pageStatus] === surveyData[pageStatus]?.availableLength && 
                        <span className="star">★</span>
                      }
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-5 col-lg-5">
                <div id="wizard_container">
                  <form id="wrapped" method="POST" autoComplete="off">
                    <input id="website" name="website" type="text" value="" style={{ display: 'none' }} />
                    <div id="middle-wizard">
                      {surveyData.map((item, index) => {
                        if (pageStatus + 1 === item.id) {
                          return (
                            <SurveyGroup
                              key={index}
                              id={item.id}
                              pageStatus={pageStatus}
                              surveyData={item.content}
                              totalErrors={totalErrors}
                              answerContent={answerContent}
                              handleSetAnswerContent={handleSetAnswerContent}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                    <div id="bottom-wizard">
                      {pageStatus !== 0 && <button type="button" name="backward" onClick={prevBtnFunction} className="backward">Prev</button>}
                      {pageStatus !== surveyData.length && <button type="button" name="forward" onClick={nextBtnFunction} className="forward">Next</button>}
                
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {
        modalShowStatus && (
          <div className='StepModalContainer'>
            <div className='StepModalRelative1'>
              <div className='StepModal'>

                <button 
                  className='closeButton' 
                  onClick={() => setModalShowStatus(false)}
                  style={{
                    position: 'absolute',
                    top: '0px',
                    right: '15px',
                    background: 'transparent',
                    border: 'none',
                    fontSize: '40px',
                    cursor: 'pointer',
                  }}
                >
                  &times;
                </button>

                <h1>{ surveyData[pageStatus].title }</h1>
                <div className='modalScore'>
                  <div className='mainPanel'>
                    {
                      surveyData[pageStatus].content.map((item, index) => {
                        if (item.dataType === "verticalCheckBox") {
                          return (
                            <div className='item' key={index}>
                              <h2 className='title'>{item.dataTitle}</h2>
                              <DisplayContent basicData={item.dataContent} answerData={answerContent[pageStatus][index]} />
                            </div>
                          );
                        } else {
                          return (
                            <div className='item' key={index}>
                              <h2 className='title'>{item.dataTitle}</h2>
                              <p className='content'>{answerContent[pageStatus][index]}</p>
                            </div>
                          );
                        }
                      })
                    }
                  </div>
                  <div className="StepFlexRow">
                    <div className="stepFlexRowfix">
                     {
                        // Check if scoreNumber is not null or undefined to render the score and message
                        scoreNumber !== null && scoreNumber !== undefined && (
                          <div className='result'>
                            <h1>Score :</h1>
                            <div className="scoreNumber1">{scoreNumber}</div><br />
                            {scoreMessage}
                          </div>
                        )
                      }

                      {
                        pageStatus === surveyData.length - 1 ? (
                          <div className="button-24 button-24-green" onClick={handleUltimateData}>
                            Submit
                          </div>
                        ) : (
                          <div className="button-24 button-24-green" style={{ marginTop: "30px", width: "100%" }} onClick={() => {
                            setModalShowStatus(false);
                            if (roommateStatus) {
                              setPageStatus(pageStatus + 1); // Prevent exceeding total pages
                            } else {
                              setPageStatus(pageStatus + 2); // Prevent exceeding total pages
                              setRoommateStatus(true);
                            }
                          }}>
                            Go to Next Step
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div>
  );
}