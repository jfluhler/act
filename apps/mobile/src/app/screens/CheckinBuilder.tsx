import {
  Achievement,
  AchievementCategory,
  User
} from '@act/data/core';
import db, { useActAuth } from '@act/data/rn';
import Selector from '../shared/components/Selector';
import React, { FC, useEffect, useState } from 'react';
import { groupBy, toPairs } from 'lodash';
import { ScrollView } from 'react-native';
import { Row, Rows, Stack } from '@mobily/stacks';
import { Avatar, Card, TextInput } from 'react-native-paper';
import { AwesomeButtonMedium } from '../AwesomeButton';
import { CreateCheckin } from '@act/data/core';
import { CheckinSuccess } from '../checkin/CheckinSuccess';
import { getDefaultFont } from '../core/getDefaultFont';

const CheckinBuilder: FC = () => {
  const users = db.useCollection<User>('users');

  const { currentUser } = useActAuth();

  const [checkin, setCheckin] = useState<CreateCheckin>({
    users: [currentUser.id],
    isAdmin: currentUser.admin
  });
  const [checkinCreated, setCheckinCreated] = useState(false);
  const [numberOfAchievements, setNumberOfAchievements] = useState(0);

  useEffect(() => {
    checkin?.achievementCounts &&
      setNumberOfAchievements(
        Array.from(checkin?.achievementCounts).reduce((acc, item) => {
          const [id, count] = item;
          return acc + count;
        }, 0)
      );
  }, [checkin?.achievementCounts]);

  return (
    <>
      <Rows space={2}>
        <Row>
          <ScrollView>
            <Stack space={2} padding={2}>
              <Card>
                <Card.Title
                  title="Checkin Note"
                  subtitle="Write a note for this checkin"
                  left={(props) => (
                    <Avatar.Icon
                      {...props}
                      icon="pencil-circle-outline"
                    />
                  )}
                />
                <Card.Content style={{ display: 'flex' }}>
                  <TextInput
                    textAlign="left"
                    label="Checkin Note"
                    value={checkin?.insertProps?.note || ''}
                    mode="outlined"
                    theme={{
                      fonts: {
                        regular: {
                          fontFamily: getDefaultFont()
                        }
                      }
                    }}
                    onChangeText={(text) =>
                      setCheckin({
                        ...checkin,
                        insertProps: { note: text }
                      })
                    }
                  />
                </Card.Content>
              </Card>
              <Selector<Achievement, AchievementCategory>
                value={checkin?.achievementCounts}
                type={'TABBED_LIST'}
                single="Achievement"
                plural="Achievements"
                icon="checkbox-multiple-marked-circle-outline"
                optionTitleProperty="name"
                title="Checkin Achievements"
                subtitle="Select one or more achievements to checkin"
                fullHeight={true}
                showCountDropdown={true}
                showPointCount={true}
                selectable={true}
                showInfoButton={true}
                onInfoButtonPress={() => {}}
                onSelectorChange={(
                  achievementCounts: Map<string, number>,
                  points: number
                ) =>
                  setCheckin({
                    ...checkin,
                    achievementCounts,
                    points
                  })
                }
              />
              {currentUser?.admin && (
                <Selector<User>
                  data={users}
                  value={checkin?.users}
                  single="User"
                  plural="Users"
                  icon="account-box-multiple-outline"
                  optionTitleProperty="fullName"
                  optionSubtitleProperty="username"
                  title="Checkin Users"
                  subtitle="Select one or more users to checkin"
                  inlineTags={true}
                  onSelectorChange={(selectedItems: string[]) =>
                    setCheckin({
                      ...checkin,
                      users: selectedItems
                    })
                  }
                />
              )}
            </Stack>
          </ScrollView>
        </Row>
        <Row padding={1} height="content">
          <AwesomeButtonMedium
            onPress={async () => {
              const users = !currentUser.admin
                ? [currentUser.id]
                : checkin.users;
              const newCheckinCreated =
                await db.models.checkins.create({
                  ...checkin,
                  users
                });
              setCheckin({
                ...checkin,
                users,
                created: newCheckinCreated
              });
              setCheckinCreated(true);
            }}
          >
            Create Checkin
          </AwesomeButtonMedium>
        </Row>
      </Rows>
      <CheckinSuccess
        visible={checkinCreated}
        onDismiss={() => {
          setCheckinCreated(false);
          setCheckin({
            isAdmin: currentUser.admin,
            achievementCounts: new Map(),
            users: [currentUser.id],
            points: 0,
            insertProps: undefined
          });
        }}
        numberOfAchievements={numberOfAchievements || 0}
        points={checkin?.points || 0}
        timestamp={checkin?.created}
        note={checkin?.insertProps?.note}
        userCount={checkin?.users?.length}
      />
    </>
  );
};

export default CheckinBuilder;
