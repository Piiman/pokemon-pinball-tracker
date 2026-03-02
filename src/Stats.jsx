import { Center, ColorSwatch, Flex, Progress, RingProgress, ScrollArea, SegmentedControl, Switch, Table, Text, Title } from "@mantine/core";
import { useLocalStorage } from '@mantine/hooks';

import pokedex from './pokedex.json';
import { useState } from "react";
import { ExportButton, ImportButton } from "./ImportExport";

export function Stats() {
  const [captured] = useLocalStorage({
    key: 'captured-id-list',
    defaultValue: [],
  });

  const [eReader] = useLocalStorage({
    key: 'e-reader-filter',
  });

  const [areaView, setAreaView] = useState("all");
  const [includeShared, setIncludeShared ] = useState(true);

  const counts = captured.reduce((acc, id) => {
    if (id > 201 && !eReader) return acc;
    const board = pokedex[id - 1].board;
    if (acc[board].total !== undefined) {
      acc[board].total++;
    }
    
    if(pokedex[id - 1].area.length == 0) acc[board].any++;
    if (board == "any" && pokedex[id - 1].area.join("/") == ["lilycove", "beach"].join("/")){
      acc[board]["lilycove/beach"]++;
      return acc;
    }
    for(const area of pokedex[id - 1].area){
      if (area == "egg" && pokedex[id - 1].area.length != 1 && pokedex[id - 1].pre != "") continue;
      if (acc[board][area] !== undefined) {
        acc[board][area]++;
      }
    }
    return acc;
  }, {
    any: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      ruins: 0,
      egg: 0,
      any: 0,
      "lilycove/beach": 0,
    },
    ruby: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      egg: 0,
      any: 0,
      "safari zone": 0,
      mountain: 0,
      lilycove: 0,
    },
    sapphire: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      egg: 0,
      any: 0,
      lake: 0,
      desert: 0,
      beach: 0,
    } 
  });
  let totalPokes = pokedex.length - (!eReader ? 4 : 0);

  const totals = pokedex.reduce((acc, poke) => {
    if (poke.id > 201 && !eReader) return acc;
    const board = poke.board;
    if (acc[board].total !== undefined) {
      acc[board].total++;
    }
    
    if(poke.area.length == 0) acc[board].any++;
    if (board == "any" && poke.area.join("/") == ["lilycove", "beach"].join("/")){
      acc[board]["lilycove/beach"]++;
      return acc;
    }
    for(const area of poke.area){
      if (area == "egg" && poke.area.length != 1 && poke.pre != "") continue;
      if (acc[board][area] !== undefined) {
        acc[board][area]++;
      }
    }
    return acc;
  }, { 
    any: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      ruins: 0,
      egg: 0,
      any: 0,
      "lilycove/beach": 0,
    },
    ruby: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      egg: 0,
      any: 0,
      "safari zone": 0,
      mountain: 0,
      lilycove: 0,
    },
    sapphire: {
      total: 0,
      forest: 0,
      cave: 0,
      plains: 0,
      egg: 0,
      any: 0,
      lake: 0,
      desert: 0,
      beach: 0,
    }
  });

  let anyPercent = (counts.any.total / totalPokes) * 100;
  let rubyPercent = (counts.ruby.total / totalPokes) * 100;
  let sapphirePercent = (counts.sapphire.total / totalPokes) * 100;

  const displayCounts = {};
  const displayTotals = {};

  Object.keys(counts).forEach(boardName => {
    if((boardName == "sapphire" || (!includeShared && boardName == "any")) && areaView == "ruby") return;
    if((boardName == "ruby" || (!includeShared && boardName == "any")) && areaView == "sapphire") return;
    
    let board = counts[boardName];
    for (const [key, value] of Object.entries(board)) {
      let normalKey = areaView != "all" && key == "lilycove/beach" ? (areaView == "ruby" ? "lilycove" : "beach" ) : key
      displayCounts[normalKey] = (displayCounts[normalKey] || 0) + value;
    }
  });

  Object.keys(totals).forEach(boardName => {
    if((boardName == "sapphire" || (!includeShared && boardName == "any")) && areaView == "ruby") return;
    if((boardName == "ruby" || (!includeShared && boardName == "any")) && areaView == "sapphire") return;

    let board = totals[boardName];
    for (const [key, value] of Object.entries(board)) {
      let normalKey = areaView != "all" && key == "lilycove/beach" ? (areaView == "ruby" ? "lilycove" : "beach" ) : key
      displayTotals[normalKey] = (displayTotals[normalKey] || 0) + value;
    }
  });

  const colorMap = {
    forest: "#2b8a3e",
    cave: "#45261a",
    plains: "#a9e34b",
    ruins: "#5f3dc4",
    egg: "#fcc2d7",
    any: "#d6336c",
    "lilycove/beach": "#364fc7",
    "safari zone": "#ffd43b",
    "mountain": "#f03e3e",
    "lilycove": "#0ca678",
    "lake": "#228be6",
    "desert": "#ff922b",
    "beach": "#ffe066",
  };
  
  let ringSections = Object.keys(displayCounts).map((key) => {return key != "total" ? {value: (displayCounts[key] / displayTotals.total) * 100, color: colorMap[key]} : null}).filter(x => x != null);
  let areaTableRows = Object.keys(displayCounts).map((key) => {return key != "total" ? <ProgressTableRow title={key} percent={(displayCounts[key] / displayTotals[key]) * 100} count={displayCounts[key]} total={displayTotals[key]} color={colorMap[key]}/> : null})
  
  return (<ScrollArea>
    <Flex direction="column">
      <Flex mt="xs" mx="xs" justify="space-between" align="center">
        <Title order={2}>Progress</Title>
        <ExportButton/>
        <ImportButton/>
      </Flex>
      
      <Title order={4} mx="xs">Field</Title>
      <Center>
        <Progress.Root size="xl" w="95%">
          <Progress.Section color="green" value={anyPercent} animated>
            {/* <Progress.Label>Any</Progress.Label> */}
          </Progress.Section>
          <Progress.Section color="red" value={rubyPercent} animated>
            {/* <Progress.Label>Ruby</Progress.Label> */}
          </Progress.Section>
          <Progress.Section color="blue" value={sapphirePercent} animated>
            {/* <Progress.Label>Sapphire</Progress.Label> */}
          </Progress.Section>
        </Progress.Root>
      </Center>
      <Table mb={32} ta="center">
        <Table.Thead>
          <Table.Tr>
            <Table.Td></Table.Td>
            <Table.Td>%Caught</Table.Td>
            <Table.Td>%Missing</Table.Td>
            <Table.Td>Fraction</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          <ProgressTableRow title="Total" percent={anyPercent + rubyPercent + sapphirePercent} count={counts.any.total + counts.ruby.total + counts.sapphire.total} total={totalPokes} color="green"/>
          {/* <ProgressTableRow title="Any" percent={anyPercent} count={counts.any.total} total={totals.any.total - (!eReader ? 4 : 0)}/>
          <ProgressTableRow title="Ruby" percent={rubyPercent} count={counts.ruby.total} total={totals.ruby.total - (!eReader ? 4 : 0)}/> */}
          <ProgressTableRow title="Ruby" percent={(counts.any.total + counts.ruby.total) / (totals.any.total + totals.ruby.total) * 100} count={counts.any.total + counts.ruby.total} total={totals.any.total + totals.ruby.total} color="red"/>
          {/* <ProgressTableRow title="Sapphire" percent={sapphirePercent} count={counts.sapphire.total} total={totals.sapphire.total - (!eReader ? 4 : 0)}/> */}
          <ProgressTableRow title="Sapphire" percent={(counts.any.total + counts.sapphire.total) / (totals.any.total + totals.sapphire.total) * 100} count={counts.any.total + counts.sapphire.total} total={totals.any.total + totals.sapphire.total} color="blue"/>
        </Table.Tbody>
      </Table>
      <Flex justify="space-between" align="center">
        <Title order={4} mx="xs">Area</Title>
        {areaView != "all" ? <Switch mx="xs" label="Include shared pokemon" checked={includeShared} onChange={(event) => setIncludeShared(event.currentTarget.checked)} labelPosition="left" withThumbIndicator={false}/> : null}
      </Flex>
      <Center mx="xs">
        <SegmentedControl
          w="100%"
          value={areaView}
          onChange={setAreaView}
          color={areaView == "all" ? "green" : areaView == "ruby" ? "red" : "blue"}
          data={[
            { label: "All", value: "all" },
            { label: "Ruby", value: "ruby" },
            { label: "Sapphire", value: "sapphire" },
          ]}
        />
      </Center>
      <Center>
        <RingProgress
          size={300}
          thickness={40}
          label={
            <Text ta="center">
              {areaView == "all" ? "All Areas" : areaView == "ruby" ? "Ruby Only" : "Sapphire Only" }
            </Text>
          }
          sections={ringSections}
        />
      </Center>
      <Table mb={32} ta="center">
        <Table.Thead>
          <Table.Tr>
            <Table.Td></Table.Td>
            <Table.Td>%Caught</Table.Td>
            <Table.Td>%Missing</Table.Td>
            <Table.Td>Fraction</Table.Td>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{areaTableRows}</Table.Tbody>
      </Table>
    </Flex>
  </ScrollArea>
  );
}

function ProgressTableRow({title, percent, count, total, color}) {
  return (<Table.Tr>
    <Table.Td><Flex align="center" gap="xs"><ColorSwatch size={10} color={color}/>{title}</Flex></Table.Td>
    <Table.Td>{(percent).toFixed(2)}%</Table.Td>
    <Table.Td>{(100 - percent).toFixed(2)}%</Table.Td>
    <Table.Td>{count} / {total}</Table.Td>
  </Table.Tr>);
}