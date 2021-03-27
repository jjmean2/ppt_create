import { Box } from "@material-ui/core";
import React, { ReactElement } from "react";
import BasicAppBar from "./BasicAppBar";

function asPage<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  function PageComponent(props: P): ReactElement {
    return (
      <Box display="flex" flexDirection="column" height="100vh">
        <BasicAppBar />
        <Box flexGrow={1}>
          <Component {...props} />
        </Box>
      </Box>
    );
  }
  PageComponent.displayName = `PageComponent(${
    Component.displayName ?? Component.name
  })`;
  return PageComponent;
}

export default asPage;
