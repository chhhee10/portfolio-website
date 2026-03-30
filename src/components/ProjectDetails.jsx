import UseContext from '../Context';
import { useContext } from "react";
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import folderIcon from '../assets/folder.png';
import githubIcon from '../assets/github.png';
import ieIcon from '../assets/ie.png';
import '../css/ProjectDetails.css';

function ProjectDetails({ windowState, project }) {
  const {
    themeDragBar,
    lastTapTime,
    setLastTapTime,
    isTouchDevice,
    updateProjectWindow,
    minimizeProjectWindow,
    closeProjectWindow,
    focusProjectWindow,
  } = useContext(UseContext);

  function handleDragStop(event, data) {
    const { x, y } = data;
    updateProjectWindow(windowState.id, (prev) => ({
      ...prev,
      x,
      y,
    }));
  }

  function handleExpandStateToggle() {
    updateProjectWindow(windowState.id, (prev) => ({
      ...prev,
      expand: !prev.expand,
      hide: false,
    }));
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      handleExpandStateToggle();
    }
    setLastTapTime(now);
  }

  function openLink(url) {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const windowStyle = windowState.expand
    ? {
        display: windowState.show && !windowState.hide ? 'block' : 'none',
        width: '100%',
        height: 'calc(100% - 37px)',
        left: `${windowState.x <= 0 ? Math.abs(windowState.x) * 2 + windowState.x : -windowState.x}px`,
        top: `${windowState.y <= 0 ? Math.abs(windowState.y) * 2 + windowState.y : -windowState.y}px`,
        zIndex: windowState.focusItem ? '999' : windowState.zIndex,
        pointerEvents: 'auto',
        resize: 'none',
      }
    : {
        display: windowState.show && !windowState.hide ? 'block' : 'none',
        zIndex: windowState.focusItem ? '999' : windowState.zIndex,
        pointerEvents: 'auto',
      };

  return (
    <Draggable
      axis="both"
      handle=".project-details_dragbar"
      grid={[1, 1]}
      scale={1}
      disabled={windowState.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 28 : 110,
        y: window.innerWidth <= 500 ? 84 : 110,
      }}
      onStop={handleDragStop}
      onStart={() => focusProjectWindow(windowState.id)}
    >
      <div
        className="project-details_window"
        onClick={(e) => {
          e.stopPropagation();
          focusProjectWindow(windowState.id);
        }}
        style={windowStyle}
      >
        <div
          className="project-details_dragbar"
          onDoubleClick={handleExpandStateToggle}
          onTouchStart={handleExpandStateToggleMobile}
          style={{ background: windowState.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="project-details_barname">
            <img src={folderIcon} alt="" />
            <span>{project.name}</span>
          </div>
          <div className="folder_barbtn-project">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                minimizeProjectWindow(windowState.id);
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                minimizeProjectWindow(windowState.id);
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <p className="dash-project"></p>
            </div>
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                handleExpandStateToggle();
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                handleExpandStateToggle();
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <motion.div className={`expand-project ${windowState.expand ? 'full' : ''}`}></motion.div>
              {windowState.expand && <div className="expand_2-project"></div>}
            </div>
            <div>
              <p
                className="x-project"
                onClick={!isTouchDevice ? (e) => {
                  e.stopPropagation();
                  closeProjectWindow(windowState.id);
                } : undefined}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  closeProjectWindow(windowState.id);
                }}
                onTouchStart={(e) => e.stopPropagation()}
              >
                ×
              </p>
            </div>
          </div>
        </div>

        <div className="project-details_menubar">
          <p>File</p>
          <p>Edit</p>
          <p>View</p>
          <p>Help</p>
        </div>

        <div
          className="project-details_body"
          style={{ height: windowState.expand ? 'calc(100svh - 138px)' : '' }}
        >
          <div className="project-details_header">
            <div className="project-details_badge">
              <img src={folderIcon} alt="" />
            </div>
            <div className="project-details_meta">
              <h2>{project.name}</h2>
              <p>{project.deployUrl ? 'Repository + deployment available' : 'Repository available'}</p>
            </div>
          </div>

          <div className="project-details_panel">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>

          <div className="project-details_actions">
            <button type="button" onClick={() => openLink(project.githubUrl)}>
              <img src={githubIcon} alt="" />
              <span>Open GitHub</span>
            </button>
            {project.deployUrl && (
              <button type="button" onClick={() => openLink(project.deployUrl)}>
                <img src={ieIcon} alt="" />
                <span>Open Live Demo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default ProjectDetails;
