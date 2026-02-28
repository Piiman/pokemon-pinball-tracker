import './App.css';
import '@mantine/core/styles.css';
import { AppShell, Burger, Group, MantineProvider } from '@mantine/core';
import { useDisclosure, useLocalStorage } from '@mantine/hooks';
import { PokedexTable } from './PokedexTable';
import { Filters } from './Filters';
import { Stats } from './Stats';

function App() {
  const [captured, setCaptured] = useLocalStorage({
    key: 'captured-id-list',
    defaultValue: [],
  });

  const [missing, SetMissing] = useLocalStorage({
    key: 'missing-filter',
    defaultValue: false
  });

  const [eReader, SetEReader] = useLocalStorage({
    key: 'e-reader-filter',
    defaultValue: false
  });

  const [poke, SetPoke] = useLocalStorage({
    key: 'poke-filter',
    defaultValue: ""
  });

  const [field, SetField] = useLocalStorage({
    key: 'field-filter',
    defaultValue: []
  });

  const [area, SetArea] = useLocalStorage({
    key: 'area-filter',
    defaultValue: []
  });

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 350,
          breakpoint: 'sm',
          collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
        }}
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={mobileOpened} onClick={toggleMobile} hiddenFrom="sm" size="sm" />
            <Burger opened={desktopOpened} onClick={toggleDesktop} visibleFrom="sm" size="sm" />
            Pokemon Pinball Ruby & Sapphire Tracker
          </Group>
        </AppShell.Header>
        <AppShell.Navbar>
          <Stats/>
        </AppShell.Navbar>
        <AppShell.Main>
          <Filters/>
          <PokedexTable/>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
