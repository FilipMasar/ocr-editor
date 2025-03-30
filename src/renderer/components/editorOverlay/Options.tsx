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
  Box,
} from '@mantine/core';
import { FC, useCallback } from 'react';
import { Layers, Sun, Type } from 'react-feather';
import { useAlto } from '../../context/app/AltoContext';
import { useAltoEditor } from '../../context/editor/AltoEditorContext';
import { useTextEditor } from '../../context/editor/AltoTextEditorContext';
import { useSettings } from '../../context/app/SettingsContext';
import { elementColors } from '../../components/elements/colors';

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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Page
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.page.backgroundColor,
                          border: `1px solid ${elementColors.page.borderColor}`,
                        }} 
                      />
                    </div>
                  }
                  checked={settings.show.page}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        page: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Margins
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.margin.backgroundColor,
                          border: `1px solid ${elementColors.margin.borderColor}`,
                        }} 
                      />
                    </div>
                  }
                  checked={settings.show.margins}
                  onChange={(e) =>
                    setSettings((old) => ({
                      ...old,
                      show: {
                        ...old.show,
                        margins: e.target.checked,
                      },
                    }))
                  }
                />
                <Checkbox
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Print Space
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.printSpace.backgroundColor,
                          border: `1px solid ${elementColors.printSpace.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Graphical Element
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.graphicalElement.backgroundColor,
                          border: `1px solid ${elementColors.graphicalElement.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Illustration
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.illustration.backgroundColor,
                          border: `1px solid ${elementColors.illustration.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Composed Block
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.composedBlock.backgroundColor,
                          border: `1px solid ${elementColors.composedBlock.borderColor}`,
                        }} 
                      />
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Text Block
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.textBlock.backgroundColor,
                          border: `1px solid ${elementColors.textBlock.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      Text Line
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.textLine.backgroundColor,
                          border: `1px solid ${elementColors.textLine.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
                  label={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      String
                      <Box 
                        style={{ 
                          width: '16px', 
                          height: '16px', 
                          backgroundColor: elementColors.string.backgroundColor,
                          border: `1px solid ${elementColors.string.borderColor}`,
                        }} 
                      />
                    </div>
                  }
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
