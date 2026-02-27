import { useState } from 'react';
import cx from 'clsx';
import { ScrollArea, Table, Checkbox, Container } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import classes from './TableScrollArea.module.css';

import pokedex from './pokedex.json';

export function PokedexTable() {
  const [scrolled, setScrolled] = useState(false);

  const [captured, setCaptured] = useLocalStorage({
    key: 'captured-id-list',
    defaultValue: [],
  });

  const [missing] = useLocalStorage({
    key: 'missing-filter',
  });

  const [eReader] = useLocalStorage({
    key: 'e-reader-filter',
  });

  const [poke] = useLocalStorage({
    key: 'name-filter',
  });

  const [field] = useLocalStorage({
    key: 'field-filter',
  });

  const [area] = useLocalStorage({
    key: 'area-filter',
  });

  const updateCaptures = (id) =>
    setCaptured((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );

  const rows = pokedex.map((row) => {
    if (!eReader && row.id > 201) return null;

    if (field != undefined && field != "" && row.board != "any" && row.board != field.toLowerCase()) return null;

    let isCaptured = captured.includes(row.id);
    if (missing && isCaptured) return null;

    if (area != undefined && area.length != 0 && row.area.length != 0) {
      let flag = true;
      for (const item of row.area) {
        if (area.includes(item)) {
          flag = false;
          break;
        }
      }
      if (flag) return null;
    }

    if (poke != undefined && poke.length >= 3 && !row.name.toLowerCase().includes(poke.toLocaleLowerCase())) return null;

    return <Table.Tr key={row.name} onClick={() => updateCaptures(row.id)}>
      <Table.Td><Checkbox
        checked={isCaptured}
        color="red"
        aria-label="Select row"
      /></Table.Td>
      <Table.Td visibleFrom="md">{row.id}</Table.Td>
      <Table.Td>{row.name}</Table.Td>
      <Table.Td>{row.board}</Table.Td>
      <Table.Td>{row.area.join("・")}</Table.Td>
      <Table.Td>{row.arrows}</Table.Td>
      <Table.Td visibleFrom="md">{row.pre}</Table.Td>
    </Table.Tr>
  });

  //TODO substract filter heigh from scroll area height 
  return (<Container>
    <ScrollArea scrollbars="y" h="70vh" maw={900} onScrollPositionChange={({ y }) => setScrolled(y !== 0)} bdrs={9}>
      <Table bg='dark'>
        <Table.Thead bg="red" className={cx(classes.header, { [classes.scrolled]: scrolled })}>
          <Table.Tr>
            <Table.Th w={0}></Table.Th>
            <Table.Th visibleFrom="md">Id</Table.Th>
            <Table.Th>Pokemon</Table.Th>
            <Table.Th>Field</Table.Th>
            <Table.Th>Area</Table.Th>
            <Table.Th>Arrows</Table.Th>
            <Table.Th visibleFrom="md">Prev. Evolution</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  </Container>);
}