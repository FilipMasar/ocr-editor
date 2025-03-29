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
  Badge,
  Tooltip,
} from '@mantine/core';
import { FC, useCallback } from 'react';
import { Layers, Sun, Type } from 'react-feather';
import { useAlto } from '../../context/app/AltoContext';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useTextEditor } from '../../context/editor/AltoTextEditorContext';
import { useSettings } from '../../context/app/SettingsContext';

const Options: FC = () => {
  const { settings, setSettings } = useSettings();
  const { alto, setAlto, textBlocks, altoVersion } = useAlto();
  const { openAltoEditor } = useAltoEditor();
  const { openTextEditor } = useTextEditor();

  const onEditWholeAlto = useCallback(() => {
    openAltoEditor(alto, () => setAlto);
  }, [alto, openAltoEditor, setAlto]);

  const onEditWholeText = useCallback(() => {
    openTextEditor('ALL', textBlocks);
  }, [openTextEditor, textBlocks]);

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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      Composed Block
                      {altoVersion && !altoVersion.startsWith('3.') && (
                        <Tooltip label="Requires ALTO v3+" position="right">
                          <Badge color="orange" size="xs">v3+</Badge>
                        </Tooltip>
                      )}
                    </div>
                  }
                  checked={settings.show.composedBlocks}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        composedBlocks: e.target.checked,
                      },
                    }))
                  }
                  disabled={altoVersion && !altoVersion.startsWith('3.')}
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
                <Checkbox
                  label="Hyphens"
                  checked={settings.show.hyphens}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        hyphens: e.target.checked,
                      },
                    }))
                  }
                />
                <Divider my="sm" />
                <Button onClick={onEditWholeText}>Edit Text</Button>
              </Paper>
            </Menu.Dropdown>
          </Menu>
        </Stack>
      </Paper>
    </div>
  );
};

export default Options;
