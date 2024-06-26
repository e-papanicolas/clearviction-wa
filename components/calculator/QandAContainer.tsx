import {
  Box, Button, Container, Stack,
} from '@mui/material';
import BlockContent from '@sanity/block-content-to-react';
import React, { useMemo } from 'react';

import { SharedCalcProps, StaticCalcProps } from '../../utils/calculator.props.ts';
import portableTextComponent from '../../utils/portableTextComponents.tsx';
import { PageContext } from '../helper/PageContext.tsx';

interface Choice {
  _key?: string;
  label: string;
  isExternalLink: boolean;
  url?: string;
  linkTo?: {
    _ref?: string;
    _type?: string;
    slug: {
      current: string;
    };
  };
  linkToOtherPageType?: {
    _ref?: string;
    _type?: string;
    slug: {
      current: string;
    };
  };
}

export default function QandAContainer({
  page, calculatorConfig, addToResponses, setOpenNotSurePopup,
}: StaticCalcProps &{
      addToResponses: SharedCalcProps['addToResponses'],
      setOpenNotSurePopup: SharedCalcProps['setOpenNotSurePopup']}) {
  const contextValue = useMemo(() => ({
    isFinalPage: page.isFinalPage,
  }), [page.isFinalPage]);

  const linkToPage = (choice: Choice) => {
    if (choice.linkTo) {
      return `/calculator/${choice.linkTo.slug.current}`;
    }
    if (choice.linkToOtherPageType) {
      return `/calculator/${choice.linkToOtherPageType.slug.current}`;
    }
    return '#';
  };

  return (
    <>
      <PageContext.Provider value={contextValue}>
        <Box data-cy="calc-block-of-content" mb={4}>
          {
            page.content && (
            <BlockContent
              blocks={page.content}
              serializers={portableTextComponent}
            />
            )
          }

        </Box>
      </PageContext.Provider>

      <Container id="choices-container" maxWidth="xs" sx={{ mb: 4 }}>

        {(page.choices || page.isQuestion) && (

        <Stack gap={2} role="group" aria-label="Choice options">
          {page.choices
                && page.choices.map((choice, index) => {
                  const linkTo = linkToPage(choice);
                  const href = choice.isExternalLink ? choice.url : linkTo;
                  return (
                    <Button
                      key={choice._key}
                      variant="contained"
                      href={href}
                      data-cy={`calc-choice-${index}`}
                      sx={{ width: '100%' }}
                      onClick={() => addToResponses(choice.label)}
                    >
                      {choice.label}
                    </Button>
                  );
                })}

          {page.isQuestion && (
          <Button
            variant="outlined"
            color="primary"
            data-cy="not-sure-button"
            sx={{ width: '100%' }}
            onClick={() => setOpenNotSurePopup(true)}
          >
            {calculatorConfig.notSureAnswer.promptText}
          </Button>
          )}

        </Stack>
        )}
      </Container>
    </>
  );
}
