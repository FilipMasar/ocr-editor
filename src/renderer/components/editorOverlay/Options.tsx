import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Menu,
  Paper,
  Slider,
  Stack,
  Text,
  Box,
} from '@mantine/core';
import { FC, useCallback, ChangeEvent } from 'react';
import { Layers, Sun, Type } from 'react-feather';
import { useAlto } from '../../context/app/AltoContext';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useSettings } from '../../context/app/SettingsContext';
import { elementColors } from '../../components/elements/colors';
import { Settings } from '../../types/app';

// Define the structure for element visibility options
type ElementVisibilityOption = {
  key: keyof Settings['show'];
  label: string;
};

const elementVisibilityOptions: ElementVisibilityOption[] = [
  { key: 'page', label: 'Page' },
  { key: 'margins', label: 'Margins' },
  { key: 'printSpace', label: 'Print Space' },
  { key: 'graphicalElements', label: 'Graphical Element' },
  { key: 'illustrations', label: 'Illustration' },
  { key: 'composedBlocks', label: 'Composed Block' },
  { key: 'textBlocks', label: 'Text Block' },
  { key: 'textLines', label: 'Text Line' },
  { key: 'strings', label: 'String' },
  { key: 'hyphens', label: 'Hyphens' },
  { key: 'spaces', label: 'Spaces' },
];

const Options: FC = () => {
  const { settings, setSettings } = useSettings();
  const { alto } = useAlto();
  const { openAltoEditor } = useAltoEditor();

  const onEditWholeAlto = useCallback(() => {
    openAltoEditor(alto);
  }, [alto, openAltoEditor]);

  // Generic handler for visibility checkboxes
  const handleVisibilityChange = useCallback((key: keyof Settings['show'], checked: boolean) => {
    setSettings((old) => ({
      ...old,
      show: {
        ...old.show,
        [key]: checked,
      },
    }));
  }, [setSettings]);

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
            closeDelay={200}
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
                
                <Text mt="md" mb="xs">Border width:</Text>
                <Slider
                  w={200}
                  min={1}
                  max={5}
                  step={1}
                  value={settings.borderWidth}
                  onChange={(value) =>
                    setSettings((old) => ({ ...old, borderWidth: value }))
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
              <Paper p="sm" w={200}>
                <Text mb="xs">Display elements:</Text>
                {elementVisibilityOptions.map((option) => (
                  <Checkbox
                    key={option.key}
                    label={
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {option.label}
                        <Box
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: elementColors[option.key].backgroundColor,
                            border: `1px solid ${elementColors[option.key].borderColor}`,
                          }}
                        />
                      </div>
                    }
                    checked={settings.show[option.key]}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                       handleVisibilityChange(option.key, e.target.checked)
                    }
                    my={4}
                  />
                ))}
                <Divider my="sm" />
                <Button onClick={onEditWholeAlto}>Edit ALTO</Button>
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
                <Type />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Paper p="sm">
                <Text mb="xs">Display text:</Text>
                <Checkbox
                  label="Text fit"
                  disabled // TODO: Implement text fit
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
                <Checkbox
                  label="Text next to"
                  checked={settings.show.textNext}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        textNext: e.target.checked,
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
