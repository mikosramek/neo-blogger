const { ipcRenderer } = window.require("electron");
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import channels from "../../shared/constants";

export const Landing = () => {
  const [files, setFiles] = useState([]);
  useEffect(() => {
    ipcRenderer.on(channels.READ_FILES, (_event, arg: string[]) => {
      setFiles(arg);
    });
    return () => {
      ipcRenderer.removeAllListeners(channels.READ_FILES);
    };
  }, []);

  useEffect(() => {
    getFiles();
  }, []);

  const getFiles = async () => {
    ipcRenderer.send(channels.READ_FILES);
  };
  return (
    <>
      <h1>Landing</h1>
      <ul>
        {files.map((filename) => {
          return (
            <li key={filename}>
              <Link to={`/editor/${filename}`}>{filename}</Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};
