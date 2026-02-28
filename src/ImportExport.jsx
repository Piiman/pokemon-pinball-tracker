import { Button, Container, FileInput } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useRef, useState } from "react";

export function ExportButton() {
  const [loading, setLoading] = useState(false);
  const [captured] = useLocalStorage({
      key: 'captured-id-list',
      defaultValue: [],
    });

  const handleClick = function () {
    setLoading(true);
    const exportJson = {
      captured: captured,
    }

    const exportBlob = new Blob([JSON.stringify(exportJson)], {type: 'application/json'});
    const exportURL = URL.createObjectURL(exportBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = exportURL;
    downloadLink.download = `PokemonPinballRSTrackerData.json`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setLoading(false);
  };

  return (<Button size="compact-sm" color="red" loading={loading} onClick={handleClick}>Export</Button>);
}

export function ImportButton() {
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useLocalStorage({
      key: 'captured-id-list',
      defaultValue: [],
    });

  const inputFile = useRef(null);

  const handleClick = function () {
    setLoading(true);
    inputFile.current.click();
  }

  const handleFileUpload = function (file) {
    //TODO display feedback
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = e => {
      const importedJson = JSON.parse(e.target.result);  
      if (!importedJson.hasOwnProperty("captured") || importedJson.captured.some(x => isNaN(x) || x > 205 || x < 1)) {
        console.log("invalid");
        setLoading(false);
        return;
      }
      setCaptured(importedJson.captured);
      setLoading(false);
    }
    fileReader.onerror = e => {
      console.log("could not read file");
      setLoading(false);
    }
  }

  return (<Container m={0} p={0}>
    <FileInput display="none" accept="application/json" ref={inputFile} onChange={handleFileUpload}/>
    <Button size="compact-sm" color="red" loading={loading} onClick={handleClick}>Import</Button>
  </Container>);
}
