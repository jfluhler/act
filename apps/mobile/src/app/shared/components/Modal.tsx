import { Column, Columns, FillView, Row, Rows } from '@mobily/stacks';
import { reduce } from 'lodash';
import React, { FC } from 'react';
import {
  Modal as PaperModal,
  Portal,
  Card
} from 'react-native-paper';
import { AwesomeButtonMedium } from '../../AwesomeButton';

const CardActions = ({ apply, onDismiss }) => {
  return (
    <Card.Actions>
      <Columns space={2}>
        <Column>
          <AwesomeButtonMedium onPress={apply}>
            Apply
          </AwesomeButtonMedium>
        </Column>
        <Column>
          <AwesomeButtonMedium type="outlined" onPress={onDismiss}>
            Cancel
          </AwesomeButtonMedium>
        </Column>
      </Columns>
    </Card.Actions>
  );
};

type ModalProps = {
  visible: boolean;
  apply: () => void;
  onDismiss: () => void;
  title: string;
  subtitle: string;
  fullHeight: boolean;
};
const Modal: FC<ModalProps> = ({
  visible,
  children,
  apply,
  onDismiss,
  title,
  subtitle,
  fullHeight
}) => (
  <Portal>
    {fullHeight ? (
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          height: '100%'
        }}
      >
        <FillView padding={2}>
          <Card
            style={{
              height: '100%'
            }}
          >
            <Rows>
              <Row height="content">
                <Card.Title title={title} subtitle={subtitle} />
              </Row>
              <Row>
                <Card.Content style={{ height: '100%' }}>
                  {children}
                </Card.Content>
              </Row>
              <Row height="content">
                <CardActions apply={apply} onDismiss={onDismiss} />
              </Row>
            </Rows>
          </Card>
        </FillView>
      </PaperModal>
    ) : (
      <PaperModal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={{
          position: 'absolute',
          width: '100%',
          bottom: 0
        }}
      >
        <Card style={{ margin: 10 }}>
          <Card.Title title={title} subtitle={subtitle} />
          <Card.Content>{children}</Card.Content>
          <CardActions apply={apply} onDismiss={onDismiss} />
        </Card>
      </PaperModal>
    )}
  </Portal>
);

export default Modal;