import { Switch, TextInput, Container, Collapse, Button, Grid, MultiSelect, Group, Image } from "@mantine/core";
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
    defaultValue: []
  });

  const [area, SetArea] = useLocalStorage({
    key: 'area-filter',
  });
  //TODO solve warning caused for using this
  const [opened, { toggle }] = useDisclosure(false);
  
  const commonAreas = ["Any", "Forest", "Cave", "Plains", "Ruins", "Egg"];
  const rubyAreas = ["Safari Zone", "Mountain", "Lilycove"];
  const sapphireAreas = ["Lake", "Desert", "Beach"];

  let toSelectOption = function (arr) {return arr.map(item => {return {value: item.toLowerCase(), label: item}})}

  let areaOptions = [{ group: 'Common', items: toSelectOption(commonAreas) }];
  if (field.length == 0 || (field.length == 1 && field[0] == "any") || field.includes("ruby")) areaOptions.push({ group: 'Ruby', items: toSelectOption(rubyAreas) });
  if (field.length == 0 || (field.length == 1 && field[0] == "any") || field.includes("sapphire")) areaOptions.push({ group: 'Sapphire', items: toSelectOption(sapphireAreas) });

  let fieldOptions = toSelectOption(["Any", "Ruby", "Sapphire"]);

  const renderAreaOption = function({option}, height, directory) {
    return (<Group>
      <Image h={{ base: height}} w="auto" fit="contains" src={`${directory}/${option.value}.png`}/>
      {option.label}
    </Group>);
  }

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
        <MultiSelect
          placeholder={field != undefined && field.length == 0 ? "Field" : ""}
          data={fieldOptions}
          renderOption={(option) => renderAreaOption(option, "1rem", "field_images")}
          value={field}
          onChange={SetField}
          clearable
          hidePickedOptions
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
        <Grid.Col span={12} display={{base: 'block', sm: 'none'}}>
          <MultiSelect
            placeholder={field != undefined && field.length == 0 ? "Field" : ""}
            data={fieldOptions}
            renderOption={(option) => renderAreaOption(option, "1rem", "field_images")}
            value={field}
            onChange={SetField}
            clearable
            hidePickedOptions
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <MultiSelect
            placeholder={area != undefined && area.length == 0 ? "Area" : ""}
            data={areaOptions}
            renderOption={(option) => renderAreaOption(option, "1.5rem", "area_images")}
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
