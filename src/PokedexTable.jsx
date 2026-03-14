import { useState } from 'react';
import cx from 'clsx';
import { ScrollArea, Table, Checkbox, Container, Image, Flex, Group } from '@mantine/core';
import { readLocalStorageValue, useLocalStorage } from '@mantine/hooks';
import { IconCaretDownFilled, IconCaretUpFilled, IconCaretUpDown, IconPokeball} from '@tabler/icons-react';
import classes from './TableScrollArea.module.css';

import pokedex from './pokedex.json';

export function PokedexTable() {
  const [scrolled, setScrolled] = useState(false);
  const [sortedData, setSortedData] = useState(pokedex);
  const [sortReversed, setSortReversed] = useState(false);
  const [sortBy, setSortBy] = useState("id");

  const [captured, setCaptured] = useLocalStorage({
    key: 'captured-id-list',
    defaultValue: [],
  });

  const missing = readLocalStorageValue({key: 'missing-filter'});

  const eReader = readLocalStorageValue({key: 'e-reader-filter'});

  const poke = readLocalStorageValue({key: 'name-filter'});

  const field = readLocalStorageValue({key: 'field-filter'});

  const area = readLocalStorageValue({key: 'area-filter'});

  const updateCaptures = (id) =>
    setCaptured((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const sortPokedex = (column, sortReversed) => {
    return [...pokedex].sort((a, b) => {
        if (sortReversed) {
            return column == "area" ? b[column][0].localeCompare(a[column][0]) : b[column].localeCompare(a[column]);
          }
    
          return column == "area" ? a[column][0].localeCompare(b[column][0]) :  a[column].localeCompare(b[column]);
      })
  }

  const setSortTable = (column) => {
    const reversed = column === sortBy ? !sortReversed : false;
    setSortReversed(reversed);
    setSortBy(column);

    setSortedData(sortPokedex(column, reversed));
  }

  const rows = sortedData.map((row) => {
    if (!eReader && row.id > 201) return null;

    if (field != undefined && field.length != 0 && !field.includes(row.board)) return null;

    let isCaptured = captured.includes(row.id);
    if (missing && isCaptured) return null;

    if (area != undefined && area.length != 0) {
      let flag = true;
      if (row.area.length == 0 && area.includes("any")) flag = false
      for (const item of row.area) {
        if (area.includes(item)) {
          flag = false;
          break;
        }
      }
      if (flag) return null;
    }

    if (poke != undefined && poke.length >= 3 && !row.name.toLowerCase().includes(poke.toLocaleLowerCase())) return null;

    const checkboxIcon = ({...others}) => {
      return <IconPokeball {...others}/>;
    }

    return <Table.Tr key={row.name} onClick={() => updateCaptures(row.id)}>
      <Table.Td><Checkbox
        icon={checkboxIcon}
        iconColor='white'
        checked={isCaptured}
        color="red"
        radius={20}
      /></Table.Td>
      <Table.Td visibleFrom="sm">{row.id}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td><Image h={{ base: "1rem" }} w="auto" fit="contains" src={`field_images/${row.board}.png`} alt={row.board}/></Table.Td>
      <Table.Td><Flex gap={5}>{
        row.area.map((area) => (<Image h={{ base: "1.5rem", sm: "2rem" }} w="auto" fit="contains" src={`area_images/${area}.png`} alt={area}/>))
      }</Flex></Table.Td>
      <Table.Td>{row.arrows}</Table.Td>
      <Table.Td visibleFrom="sm">{row.pre}</Table.Td>
    </Table.Tr>
  });

  //TODO substract filter heigh from scroll area height 
  return (<Container>
    <ScrollArea scrollbars="y" h="70vh" maw={900} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} bdrs={9}>
      <Table bg='dark'>
        <Table.Thead bg="red" className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th w={0}></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("id")} visibleFrom="sm"><Group gap={0} align='center'>Id {sortBy != "id" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("name")}><Group gap={0} align='center'>Pokemon {sortBy != "name" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("board")}><Group gap={0} align='center'>Field {sortBy != "board" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("area")}><Group gap={0} align='center'>Area {sortBy != "area" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("arrows")}><Group gap={0} align='center'>Arrows {sortBy != "arrows" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
            <Table.Th style={{cursor: "pointer"}} px={0} onClick={() => setSortTable("pre")} visibleFrom="sm"><Group gap={0} align='center'>Prev. Evolution {sortBy != "pre" ? <IconCaretUpDown/> : sortReversed ? <IconCaretUpFilled/> : <IconCaretDownFilled/>}</Group></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  </Container>);
}