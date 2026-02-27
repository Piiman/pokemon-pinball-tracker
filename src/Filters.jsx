import { Switch, TextInput, Container, Collapse, Button, Select, Grid, MultiSelect } from "@mantine/core";
import { IconChevronsDown, IconChevronsUp } from '@tabler/icons-react';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';

export function Filters() {
  const [missing, SetMissing] = useLocalStorage({
    key: 'missing-filter',
  });

  const [eReader, SetEReader] = useLocalStorage({
    key: 'e-reader-filter',
  });

  const [poke, SetPoke] = useLocalStorage({
    key: 'name-filter',
  });

  const [field, SetField] = useLocalStorage({
    key: 'field-filter',
  });

  const [area, SetArea] = useLocalStorage({
    key: 'area-filter',
  });
  //TODO solve warning caused for using this
  const [opened, { toggle }] = useDisclosure(false);
  

  const commonAreas = ["Forest", "Cave", "Plains", "Ruins", "Egg"];
  const rubyAreas = ["Safari Zone", "Mountain", "Lilycove"];
  const sapphireAreas = ["Lake", "Desert", "Beach"];

  let toSelectOption = function (arr) {return arr.map(item => {return {value: item.toLowerCase(), label: item}})}

  let areaOptions = [{ group: 'Common', items: toSelectOption(commonAreas) }];
  if (field == undefined || field == "" || field == "Ruby") areaOptions.push({ group: 'Ruby', items: toSelectOption(rubyAreas) });
  if (field == undefined || field == "" || field == "Sapphire") areaOptions.push({ group: 'Sapphire', items: toSelectOption(sapphireAreas) });

  return (<Container my={16} maw={900}>
    <Grid align="center" grow>
      <Grid.Col span="content">
        <Switch
          withThumbIndicator={false}
          checked={missing}
          onChange={(event) => SetMissing(event.currentTarget.checked)}
          label="Only Missing"
          color="red"
        />
      </Grid.Col>
      <Grid.Col span={4}>
        <TextInput
          placeholder="Pokemon"
          value={poke}
          onChange={(event) => SetPoke(event.currentTarget.value)}
        />
      </Grid.Col>
      <Grid.Col span={4} visibleFrom="sm">
        <Select
          placeholder="Field"
          data={['Ruby', 'Sapphire']}
          value={field}
          onChange={SetField}
          clearable
        />
      </Grid.Col>
    </Grid>
    <Button variant="transparent" fullWidth color="red" onClick={toggle}>
      {opened ? <IconChevronsUp/> : <IconChevronsDown/>}
    </Button>
    <Collapse in={opened}>
      <Grid align="center" grow>
        <Grid.Col span="content">
          <Switch
            withThumbIndicator={false}
            checked={eReader}
            onChange={(event) => SetEReader(event.currentTarget.checked)}
            label="Show e-Reader Pokemon"
            color="red"
          />
        </Grid.Col>
        <Grid.Col span={4} display={{base: 'block', sm: 'none'}}>
          <Select
            placeholder="Field"
            data={['Ruby', 'Sapphire']}
            value={field}
            onChange={SetField}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MultiSelect
            placeholder={area != undefined && area.length == 0 ? "Area" : ""}
            data={areaOptions}
            value={area}
            onChange={SetArea}
            clearable
            hidePickedOptions
          />
        </Grid.Col>
      </Grid>
    </Collapse>
  </Container>);
}
