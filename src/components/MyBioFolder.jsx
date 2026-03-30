import UseContext from '../Context'
import { useContext, useState } from "react";
import Draggable from 'react-draggable'
import { motion } from 'framer-motion';
import About from '../assets/ipng.png'
import profileImage from '../assets/profile.png'
import tech from '../assets/tech.png'
import hobby from '../assets/hobby.png'
import '../css/MyBioFolder.css'


function MyBioFolder() {

  const [generalTap, setGenerapTap] = useState(true)
  const [technologyTap, setTechnologyTap] = useState(false)
  const [hobbTap, setHobbTap] = useState(false)

  const { 
    themeDragBar,
    MybioExpand, setMybioExpand,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
   } = useContext(UseContext);

  const bioText = (
    <div className="bio_text_content">
      <div className="bio_section">
        <strong>Information:</strong>
        <p>Chetan Raghuvanshi</p>
        <p>Computer Science Student</p>
        <p>Aspiring Software Engineer</p>
        <p>Interested in AI/ML, Web 3&amp; Systems</p>
        <p className="bio_email">chetanraghuvanshi85@gmail.com</p>
      </div>

      <div className="bio_section">
        <strong>Objective:</strong>
        <p>Building scalable and meaningful software while continuously improving my problem-solving skills.</p>
        <p>Currently focused on Data Structures, System Design, and real-world projects.</p>
      </div>

      <div className="bio_section">
        <strong>Location:</strong>
        <p>Bengaluru, India</p>
        <p>Open to Internships</p>
        <p>Remote / On-site</p>
      </div>
    </div>
  );

  const technologyText = (
    <div className="bio_text_content">
      <div className="bio_section">
        <strong>Core Modules Loaded:</strong>
        <p>C/C++ • Python • JavaScript • Solidity • Rust</p>
      </div>

      <div className="bio_section">
        <p><strong>UI Layer:</strong> React + Tailwind</p>
        <p><strong>Server Layer:</strong> Node.js / Express / FastAPI</p>
      </div>

      <div className="bio_section">
        <strong>Decentralized Systems:</strong>
        <p>Ethereum (Smart Contracts, Ethers.js)</p>
        <p>Solana (Rust, high-performance dApps)</p>
      </div>

      <div className="bio_section">
        <p><strong>Data Layer:</strong> MongoDB • MySQL</p>
        <p><strong>Hardware Layer:</strong> ESP32 • IoT Systems</p>
      </div>

      <div className="bio_section">
        <p><strong>Extensions:</strong> TensorFlow • OpenCV</p>
      </div>

      <div className="bio_section">
        <p><strong>Current Mode:</strong> Actively building, experimenting, and scaling systems</p>
      </div>
    </div>
  );

  const hobbyText = (
    <div className="bio_text_content">
      <div className="bio_section">
        <p>In my free time, I like working out and going for runs.</p>
        <p>I enjoy trying new food and exploring different restaurants, especially when it comes to biryani.</p>
        <p>I also like watching cricket and following matches whenever I get the chance.</p>
      </div>
    </div>
  );

      function handleDragStop(event, data) {
        const positionX = data.x 
        const positionY = data.y
        setMybioExpand(prev => ({
          ...prev,
          x: positionX,
          y: positionY
        }))

      }


  function handleBiotap(name) {
    setGenerapTap(name === 'general');
    setTechnologyTap(name === 'technology');
    setHobbTap(name === 'hobby');
  }

  const activeBtnStyle = {
    bottom: '2px',
    outline: '1px dotted black',
    outlineOffset: '-5px',
    borderBottomColor: '#c5c4c4',
    zIndex: '3'
  };


  return (
    <>
      <Draggable
        axis="both" 
        handle={'.folder_dragbar'}
        grid={[1, 1]}
        scale={1}
        disabled={MybioExpand.expand}
        bounds={{top: 0}}
        defaultPosition={{ 
          x: window.innerWidth <= 500 ? 35 : Math.max(140, Math.round(window.innerWidth * 0.3)),
          y: window.innerWidth <= 500 ? 35 : 18,
        }}
        onStop={(event, data) => handleDragStop(event, data)}
        onStart={() => handleSetFocusItemTrue('About')}
      >
        <motion.div className='bio_folder' 
            onClick={(e) => {
              e.stopPropagation();
              handleSetFocusItemTrue('About');
            }}
            style={ MybioExpand.expand ? inlineStyleExpand('About') : inlineStyle('About')}>
          <div className="folder_dragbar"
             style={{ background: MybioExpand.focusItem? themeDragBar : '#757579'}}
          >
            <div className="bio_barname">
              <img src={About} alt="About" />
              <span>About</span>
            </div>
            <div className="bio_barbtn">
              <div onClick={ !isTouchDevice ? (e) => {
                e.stopPropagation()
                setMybioExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('About')
              } : undefined
              }   
                onTouchEnd={(e) => {
                e.stopPropagation()
                setMybioExpand(prev => ({...prev, hide: true, focusItem: false}))
                StyleHide('About')
              }}
              onTouchStart={(e) => e.stopPropagation()}
              >
                <p className='dash'></p>
              </div>

                <div>
                <p className='x'
                  onClick={!isTouchDevice ? () => {
                    deleteTap('About')
                    handleBiotap('general')
                  }: undefined}
                  onTouchEnd={() => {
                    deleteTap('About')
                    handleBiotap('general')
                  }}
                >×
                </p>
              </div>
            </div>
          </div>
          <div className="file_tap_container-bio">
          <p  onClick={() => handleBiotap('general')}
              style={generalTap ? activeBtnStyle : {}}
          >General
          </p>
          <p onClick={() => handleBiotap('technology')}
              style={technologyTap ? activeBtnStyle : {}}
          >Technology
          </p>
          <p onClick={() => handleBiotap('hobby')}
                  style={hobbTap ? activeBtnStyle : {}}
          >Hobby
          </p>
          </div>
          <div className="folder_content">
            <div
              className={`folder_content-bio ${generalTap ? 'general_layout' : 'stacked_layout'}`}
            >
            <img
              alt="bioPC"
              className={generalTap ? 'bio_img' : 'bio_img_other'}
              src={generalTap ? profileImage : (technologyTap ? tech : hobby)}
            />
            <div
              className="biotext_container">

              <div className={generalTap? 'bio_text_1' : 'bio_text_1_other'}>
                {generalTap? bioText : technologyTap? technologyText : hobbyText}
              </div>   
            </div>
              
            </div>
            <div className="bio_btn_container">
              <div className="bio_btn_ok"
              onClick={!isTouchDevice ? () => {
                deleteTap('About')
                handleBiotap('general')
              } : undefined}
              onTouchEnd={() => {
                deleteTap('About')
                handleBiotap('general')
              }}
              >
                <span>
                  OK
                </span>
              </div>
              <div className="bio_btn_cancel"
              onClick={!isTouchDevice ? () => {
                deleteTap('About')
                handleBiotap('general')
              } : undefined}
              onTouchEnd={() => {
                deleteTap('About')
                handleBiotap('general')
              }}
              ><span>Cancel</span></div>
            </div>
          </div>
        </motion.div>
      </Draggable>
    </>
  )
}          

export default MyBioFolder
