import { Box, Img, IconButton } from '@chakra-ui/react';
import { CopyIcon, CheckIcon } from '@chakra-ui/icons';
import useClipboard from 'react-use-clipboard';

type CodeBlockProps = {
  imgSrc: string;
  code?: string;
};

export default function CodeBlock({ imgSrc, code = '' }: CodeBlockProps) {
  const [isCopied, setCopied] = useClipboard(code, { successDuration: 3000 });

  return (
    <Box maxW="lg" position="relative">
      <Img src={imgSrc} alt="" />
      {code && (
        <IconButton
          icon={isCopied ? <CheckIcon color="green" /> : <CopyIcon />}
          aria-label="Copy"
          position="absolute"
          right="1"
          top="1"
          variant="ghost"
          colorScheme="whiteAlpha"
          onClick={() => !isCopied && setCopied()}
        />
      )}
    </Box>
  );
}
