import {
  ActionIcon,
  Checkbox,
  Menu,
  Paper,
  Slider,
  Stack,
  Text,
} from '@mantine/core';
import { FC } from 'react';
import { Layers, Sun, Type } from 'react-feather';
import { useEditor } from 'renderer/context/EditorContext';

const Options: FC = () => {
  const { settings, setSettings } = useEditor();

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: 8,
        transform: 'translateY(-50%)',
        zIndex: 100,
      }}
    >
      <Paper withBorder px="sm" py={4}>
        <Stack spacing="md">
          <Menu
            position="right"
            trigger="hover"
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <ActionIcon>
                <Sun />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Paper p="sm">
                <Text mb="xs">Image opacity:</Text>
                <Slider
                  w={200}
                  value={settings.imageOpacity}
                  onChange={(value) =>
                    setSettings((old) => ({ ...old, imageOpacity: value }))
                  }
                />
              </Paper>
            </Menu.Dropdown>
          </Menu>

          <Menu
            position="right"
            trigger="hover"
            openDelay={100}
            closeDelay={200}
          >
            <Menu.Target>
              <ActionIcon>
                <Layers />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Paper p="sm">
                <Text mb="xs">Display elements:</Text>
                <Checkbox
                  label="Print Space"
                  checked={settings.show.printSpace}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        printSpace: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="Graphical Element"
                  checked={settings.show.graphicalElements}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        graphicalElements: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="Illustration"
                  checked={settings.show.illustrations}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        illustrations: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="Text Block"
                  checked={settings.show.textBlocks}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        textBlocks: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="Text Line"
                  checked={settings.show.textLines}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        textLines: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="String"
                  checked={settings.show.strings}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        strings: e.target.checked,
                      },
                    }))
                  }
                />
              </Paper>
            </Menu.Dropdown>
          </Menu>

          <Menu
            position="right"
            trigger="hover"
            openDelay={100}
            closeDelay={400}
          >
            <Menu.Target>
              <ActionIcon>
                <Type />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Paper p="sm">
                <Text mb="xs">Display text:</Text>
                <Checkbox
                  label="Text fit"
                  checked={settings.show.textFit}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        textFit: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label="Text above"
                  checked={settings.show.textAbove}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        textAbove: e.target.checked,
                      },
                    }))
                  }
                />
              </Paper>
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </Paper>
    </div>
  );
};

export default Options;
