import { FC, useState } from 'react';
import { Modal, Tabs, Button, Accordion, Text, List, Stack, Group, Badge } from '@mantine/core';
import { AltoComposedBlockJson, AltoTextBlockJson, AltoIllustrationJson, AltoGraphicalElementJson } from '../../types/alto';
import { 
  getTextBlocksFromComposedBlock, 
  getIllustrationsFromComposedBlock, 
  getGraphicalElementsFromComposedBlock, 
  getTextFromComposedBlock
} from '../../utils/composedBlockUtils';
import { ensureArray, toNumber } from '../../utils/alto';
import { ChevronDown, ChevronRight, Edit, Eye, Type } from 'react-feather';

interface ComposedBlockViewerProps {
  composedBlock: AltoComposedBlockJson;
  opened: boolean;
  onClose: () => void;
  onEditElement?: (
    element: AltoTextBlockJson | AltoIllustrationJson | AltoGraphicalElementJson | AltoComposedBlockJson, 
    elementType: string, 
    index: number
  ) => void;
}

const ComposedBlockViewer: FC<ComposedBlockViewerProps> = ({ 
  composedBlock, 
  opened, 
  onClose,
  onEditElement 
}) => {
  const [expandedBlock, setExpandedBlock] = useState<string | null>(null);
  
  // Extract information from the ComposedBlock
  const textBlocks = getTextBlocksFromComposedBlock(composedBlock);
  const illustrations = getIllustrationsFromComposedBlock(composedBlock);
  const graphicalElements = getGraphicalElementsFromComposedBlock(composedBlock);
  const nestedComposedBlocks = ensureArray(composedBlock.ComposedBlock || []);
  
  // Format basic info about the ComposedBlock
  const type = composedBlock['@_TYPE'] || 'Unknown';
  const id = composedBlock['@_ID'] || 'No ID';
  const width = toNumber(composedBlock['@_WIDTH']);
  const height = toNumber(composedBlock['@_HEIGHT']);
  const stylerefs = composedBlock['@_STYLEREFS'] || 'None';
  
  // Function to render a nested ComposedBlock
  const renderNestedComposedBlock = (nestedBlock: AltoComposedBlockJson, index: number) => {
    const nestedType = nestedBlock['@_TYPE'] || 'Unknown';
    const nestedId = nestedBlock['@_ID'] || `composed-block-${index}`;
    const nestedTextBlocks = getTextBlocksFromComposedBlock(nestedBlock).length;
    const nestedIllustrations = getIllustrationsFromComposedBlock(nestedBlock).length;
    const nestedGraphicalElements = getGraphicalElementsFromComposedBlock(nestedBlock).length;
    const deeperNestedBlocks = ensureArray(nestedBlock.ComposedBlock || []).length;
    
    return (
      <Accordion.Item key={index} value={nestedId}>
        <Accordion.Control>
          <Group>
            <Text weight={500}>{nestedType}</Text>
            <Text size="sm" color="dimmed">{nestedId}</Text>
            <Group spacing={5} ml="auto">
              {nestedTextBlocks > 0 && <Badge size="xs">Texts: {nestedTextBlocks}</Badge>}
              {nestedIllustrations > 0 && <Badge size="xs" color="pink">Imgs: {nestedIllustrations}</Badge>}
              {nestedGraphicalElements > 0 && <Badge size="xs" color="orange">Graphics: {nestedGraphicalElements}</Badge>}
              {deeperNestedBlocks > 0 && <Badge size="xs" color="violet">Blocks: {deeperNestedBlocks}</Badge>}
            </Group>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack spacing="xs">
            <Group position="apart">
              <Text size="sm">Dimensions: {toNumber(nestedBlock['@_WIDTH'])}×{toNumber(nestedBlock['@_HEIGHT'])}</Text>
              {onEditElement && (
                <Button 
                  size="xs" 
                  variant="subtle" 
                  leftIcon={<Edit size={14} />}
                  onClick={() => onEditElement(nestedBlock, 'ComposedBlock', index)}
                >
                  Edit
                </Button>
              )}
            </Group>
            {getTextFromComposedBlock(nestedBlock) && (
              <Text size="sm" italic>
                Text: "{getTextFromComposedBlock(nestedBlock).substring(0, 100)}
                {getTextFromComposedBlock(nestedBlock).length > 100 ? '...' : ''}"
              </Text>
            )}
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    );
  };
  
  // Function to render a text block
  const renderTextBlock = (textBlock: AltoTextBlockJson, index: number) => {
    const textLines = ensureArray(textBlock.TextLine || []).length;
    const text = textBlock.TextLine ? textLines.toString() : 'No text';
    
    return (
      <List.Item key={index}>
        <Group position="apart">
          <Text size="sm">
            Text Block {textBlock['@_ID'] ? `(${textBlock['@_ID']})` : index}
            {textLines > 0 && ` - ${textLines} lines`}
          </Text>
          {onEditElement && (
            <Button 
              size="xs" 
              variant="subtle" 
              leftIcon={<Edit size={14} />}
              onClick={() => onEditElement(textBlock, 'TextBlock', index)}
            >
              Edit
            </Button>
          )}
        </Group>
      </List.Item>
    );
  };
  
  // Function to render an illustration
  const renderIllustration = (illustration: AltoIllustrationJson, index: number) => {
    return (
      <List.Item key={index}>
        <Group position="apart">
          <Text size="sm">
            Illustration {illustration['@_ID'] ? `(${illustration['@_ID']})` : index} 
            {illustration['@_TYPE'] && ` - Type: ${illustration['@_TYPE']}`}
          </Text>
          {onEditElement && (
            <Button 
              size="xs" 
              variant="subtle" 
              leftIcon={<Edit size={14} />}
              onClick={() => onEditElement(illustration, 'Illustration', index)}
            >
              Edit
            </Button>
          )}
        </Group>
      </List.Item>
    );
  };
  
  // Function to render a graphical element
  const renderGraphicalElement = (element: AltoGraphicalElementJson, index: number) => {
    return (
      <List.Item key={index}>
        <Group position="apart">
          <Text size="sm">
            Graphical Element {element['@_ID'] ? `(${element['@_ID']})` : index}
          </Text>
          {onEditElement && (
            <Button 
              size="xs" 
              variant="subtle" 
              leftIcon={<Edit size={14} />}
              onClick={() => onEditElement(element, 'GraphicalElement', index)}
            >
              Edit
            </Button>
          )}
        </Group>
      </List.Item>
    );
  };
  
  return (
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title={`ComposedBlock - ${type} (${id})`}
      size="lg"
    >
      <Stack spacing="md">
        <Group position="apart">
          <Stack spacing={5}>
            <Text>Type: {type}</Text>
            <Text>ID: {id}</Text>
            <Text>Dimensions: {width}×{height}</Text>
            <Text>Style References: {stylerefs}</Text>
          </Stack>
          <Group>
            <Badge size="lg" color="blue">Texts: {textBlocks.length}</Badge>
            <Badge size="lg" color="pink">Illustrations: {illustrations.length}</Badge>
            <Badge size="lg" color="orange">Graphics: {graphicalElements.length}</Badge>
            <Badge size="lg" color="violet">Nested Blocks: {nestedComposedBlocks.length}</Badge>
          </Group>
        </Group>

        <Tabs defaultValue="nested">
          <Tabs.List>
            {nestedComposedBlocks.length > 0 && (
              <Tabs.Tab value="nested" icon={<ChevronDown size={14} />}>
                Nested Blocks
              </Tabs.Tab>
            )}
            {textBlocks.length > 0 && (
              <Tabs.Tab value="text" icon={<Type size={14} />}>
                Text
              </Tabs.Tab>
            )}
            {illustrations.length > 0 && (
              <Tabs.Tab value="illustrations" icon={<Eye size={14} />}>
                Illustrations
              </Tabs.Tab>
            )}
            {graphicalElements.length > 0 && (
              <Tabs.Tab value="graphical" icon={<ChevronRight size={14} />}>
                Graphical Elements
              </Tabs.Tab>
            )}
          </Tabs.List>

          {nestedComposedBlocks.length > 0 && (
            <Tabs.Panel value="nested" pt="xs">
              <Accordion 
                chevronPosition="right" 
                multiple
                value={expandedBlock ? [expandedBlock] : []}
                onChange={(val) => setExpandedBlock(Array.isArray(val) && val.length > 0 ? val[0] : null)}
              >
                {nestedComposedBlocks.map(renderNestedComposedBlock)}
              </Accordion>
            </Tabs.Panel>
          )}

          {textBlocks.length > 0 && (
            <Tabs.Panel value="text" pt="xs">
              <List spacing="xs">
                {textBlocks.map(renderTextBlock)}
              </List>
            </Tabs.Panel>
          )}

          {illustrations.length > 0 && (
            <Tabs.Panel value="illustrations" pt="xs">
              <List spacing="xs">
                {illustrations.map(renderIllustration)}
              </List>
            </Tabs.Panel>
          )}

          {graphicalElements.length > 0 && (
            <Tabs.Panel value="graphical" pt="xs">
              <List spacing="xs">
                {graphicalElements.map(renderGraphicalElement)}
              </List>
            </Tabs.Panel>
          )}
        </Tabs>
        
        <Group position="right">
          <Button 
            color="gray" 
            onClick={onClose}
          >
            Close
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default ComposedBlockViewer; 