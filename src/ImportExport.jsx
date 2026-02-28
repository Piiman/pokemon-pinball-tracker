import { Button } from "@mantine/core";
import { useLocalStorage } from "@mantine/hooks";
import { useState } from "react";

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

  return (<Button size="compact-xs" color="red" loading={loading} onClick={handleClick}>Export</Button>);
}