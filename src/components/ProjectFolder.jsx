import UseContext from '../Context';
import { useContext } from "react";
import Draggable from 'react-draggable';
import { motion } from 'framer-motion';
import Project from '../assets/regFolder.png';
import folderIcon from '../assets/folder.png';
import projects from '../data/projects';
import '../css/ProjectFolder.css';

function ProjectFolder() {
  const {
    themeDragBar,
    ProjectExpand,
    setProjectExpand,
    projectWindows,
    openProjectWindow,
    lastTapTime,
    setLastTapTime,
    StyleHide,
    isTouchDevice,
    handleSetFocusItemTrue,
    inlineStyleExpand,
    inlineStyle,
    deleteTap,
  } = useContext(UseContext);

  function handleDragStop(event, data) {
    const { x, y } = data;
    setProjectExpand((prev) => ({
      ...prev,
      x,
      y,
    }));
  }

  function handleExpandStateToggle() {
    setProjectExpand((prevState) => ({
      ...prevState,
      expand: !prevState.expand,
    }));
  }

  function handleExpandStateToggleMobile() {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      setProjectExpand((prevState) => ({
        ...prevState,
        expand: !prevState.expand,
      }));
    }
    setLastTapTime(now);
  }

  function openProjectDirectory(project) {
    openProjectWindow(project);
  }

  function openProjectDirectoryMobile(project) {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      openProjectDirectory(project);
    }
    setLastTapTime(now);
  }

  const totalSize = projects.reduce((sum, project) => sum + project.sizeKb, 0);

  return (
    <Draggable
      axis="both"
      handle=".folder_dragbar-project"
      grid={[1, 1]}
      scale={1}
      disabled={ProjectExpand.expand}
      bounds={{ top: 0 }}
      defaultPosition={{
        x: window.innerWidth <= 500 ? 20 : Math.max(220, Math.round(window.innerWidth * 0.66)),
        y: window.innerWidth <= 500 ? 40 : 240,
      }}
      onStop={handleDragStop}
      onStart={() => handleSetFocusItemTrue('Project')}
    >
      <div
        className="folder_folder-project"
        onClick={(e) => {
          e.stopPropagation();
          handleSetFocusItemTrue('Project');
        }}
        style={ProjectExpand.expand ? inlineStyleExpand('Project') : inlineStyle('Project')}
      >
        <div
          className="folder_dragbar-project"
          onDoubleClick={handleExpandStateToggle}
          onTouchStart={handleExpandStateToggleMobile}
          style={{ background: ProjectExpand.focusItem ? themeDragBar : '#757579' }}
        >
          <div className="folder_barname-project">
            <img src={Project} alt="Project" />
            <span>Project</span>
          </div>
          <div className="folder_barbtn-project">
            <div
              onClick={!isTouchDevice ? (e) => {
                e.stopPropagation();
                setProjectExpand((prev) => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Project');
              } : undefined}
              onTouchEnd={(e) => {
                e.stopPropagation();
                setProjectExpand((prev) => ({ ...prev, hide: true, focusItem: false }));
                StyleHide('Project');
              }}
              onTouchStart={(e) => e.stopPropagation()}
            >
              <p className="dash-project"></p>
            </div>
            <div
              onClick={!isTouchDevice ? handleExpandStateToggle : undefined}
              onTouchEnd={handleExpandStateToggle}
            >
              <motion.div className={`expand-project ${ProjectExpand.expand ? 'full' : ''}`}></motion.div>
              {ProjectExpand.expand && <div className="expand_2-project"></div>}
            </div>
            <div>
              <p
                className="x-project"
                onClick={!isTouchDevice ? () => deleteTap('Project') : undefined}
                onTouchEnd={() => deleteTap('Project')}
              >
                ×
              </p>
            </div>
          </div>
        </div>

        <div className="file_edit_container-project">
          <p>File<span style={{ left: '-23px' }}>_</span></p>
          <p>Edit<span style={{ left: '-24px' }}>_</span></p>
          <p>View<span style={{ left: '-32px' }}>_</span></p>
          <p>Help<span style={{ left: '-30px' }}>_</span></p>
        </div>

        <div
          className="folder_content-project"
          style={{ height: ProjectExpand.expand ? 'calc(100svh - 122px)' : '' }}
        >
          <div className="project_directory_list">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className={`project_directory_item ${projectWindows.some(windowItem => windowItem.project.id === project.id && !windowItem.hide) ? 'active' : ''}`}
                onDoubleClick={() => openProjectDirectory(project)}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  openProjectDirectoryMobile(project);
                }}
              >
                <img src={folderIcon} alt="" />
                <span>{project.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="btm_bar_container-project">
          <div className="object_bar-project">
            <p>{projects.length} object(s)</p>
          </div>
          <div className="size_bar-project">
            <p>{totalSize} KB</p>
          </div>
        </div>
      </div>
    </Draggable>
  );
}

export default ProjectFolder;
