import {
  BellOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
} from '@ant-design/icons'
import { App, Badge, Button, Empty, Popover, Spin, Typography } from 'antd'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

import { useNotifications, type AppNotification } from '@/entities/notification'
import { formatDateTime } from '@/shared/lib'

const { Text } = Typography

const Panel = styled.div`
  width: min(380px, calc(100vw - 32px));
  max-height: min(520px, calc(100vh - 120px));
  overflow: auto;
`

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(2)};
  padding-bottom: ${({ theme }) => theme.spacing(2)};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: ${({ theme }) => theme.spacing(2)};
`

const Item = styled.button<{ $unread: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(2)};
  width: 100%;
  padding: ${({ theme }) => theme.spacing(2.5)};
  text-align: left;
  cursor: pointer;
  background: ${({ theme, $unread }) =>
    $unread ? theme.colors.primarySoft : 'transparent'};
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background-color 0.2s ease;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.primarySoft};
    outline: none;
  }
`

const ItemIcon = styled.span<{ $type: AppNotification['type'] }>`
  display: inline-flex;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${({ theme, $type }) =>
    $type === 'review-approved' ? theme.colors.success : theme.colors.danger};
`

const ItemContent = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`

const ItemTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
`

const ItemMessage = styled.span`
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Reason = styled.span`
  display: block;
  padding: ${({ theme }) => `${theme.spacing(1.5)} ${theme.spacing(2)}`};
  margin-top: 2px;
  font-size: 12px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.danger};
  background: rgba(229, 72, 77, 0.08);
  border-radius: ${({ theme }) => theme.radii.sm};
`

const ItemDate = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
`

const PanelFooter = styled.div`
  padding-top: ${({ theme }) => theme.spacing(2)};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`

const Center = styled.div`
  display: grid;
  padding: ${({ theme }) => theme.spacing(6)} 0;
  place-items: center;
`

const ErrorText = styled(Text)`
  display: block;
  padding: ${({ theme }) => theme.spacing(2)} 0;
  font-size: 12px;
`

const EmptyText = styled(Text)`
  font-size: 13px;
`

interface NotificationItemProps {
  notification: AppNotification
  onOpen: (notification: AppNotification) => void
}

const NotificationItem = ({ notification, onOpen }: NotificationItemProps) => (
  <Item
    type="button"
    $unread={!notification.isRead}
    onClick={() => onOpen(notification)}
  >
    <ItemIcon $type={notification.type}>
      {notification.type === 'review-approved' ? (
        <CheckCircleFilled />
      ) : (
        <CloseCircleFilled />
      )}
    </ItemIcon>

    <ItemContent>
      <ItemTitle>{notification.title}</ItemTitle>
      <ItemMessage>{notification.message}</ItemMessage>
      {notification.reason ? <Reason>Причина: {notification.reason}</Reason> : null}
      <ItemDate>{formatDateTime(notification.createdAt)}</ItemDate>
    </ItemContent>
  </Item>
)

export const NotificationBell = () => {
  const { message } = App.useApp()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    refresh,
    markRead,
    markAllRead,
  } = useNotifications()

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen)

    if (nextOpen) {
      void refresh()
    }
  }

  const handleNotificationOpen = async (notification: AppNotification) => {
    try {
      if (!notification.isRead) {
        await markRead(notification.id)
      }
    } catch (cause) {
      message.error(
        cause instanceof Error ? cause.message : 'Не удалось отметить уведомление',
      )
    }

    setIsOpen(false)
    navigate(`/reviews/${notification.reviewId}`)
  }

  const handleMarkAll = async () => {
    try {
      await markAllRead()
      message.success('Все уведомления прочитаны')
    } catch (cause) {
      message.error(
        cause instanceof Error ? cause.message : 'Не удалось прочитать уведомления',
      )
    }
  }

  const content = (
    <Panel>
      <PanelHeader>
        <Text strong>Уведомления</Text>
        {unreadCount > 0 ? (
          <Button type="link" size="small" onClick={() => void handleMarkAll()}>
            Прочитать все
          </Button>
        ) : null}
      </PanelHeader>

      {error ? (
        <ErrorText type="danger">
          {error}{' '}
          <Button type="link" size="small" onClick={() => void refresh()}>
            Повторить
          </Button>
        </ErrorText>
      ) : null}

      {isLoading && notifications.length === 0 ? (
        <Center>
          <Spin size="small" />
        </Center>
      ) : notifications.length > 0 ? (
        <List>
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onOpen={(item) => void handleNotificationOpen(item)}
            />
          ))}
        </List>
      ) : (
        <Center>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<EmptyText>Новых уведомлений нет</EmptyText>}
          />
        </Center>
      )}

      {unreadCount > 0 ? (
        <PanelFooter>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Непрочитанных: {unreadCount}
          </Text>
        </PanelFooter>
      ) : null}
    </Panel>
  )

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      open={isOpen}
      onOpenChange={handleOpenChange}
      destroyOnHidden
    >
      <Badge count={unreadCount} size="small" offset={[-2, 2]}>
        <Button
          type="text"
          shape="circle"
          icon={<BellOutlined />}
          aria-label="Уведомления"
          title="Уведомления"
        />
      </Badge>
    </Popover>
  )
}
