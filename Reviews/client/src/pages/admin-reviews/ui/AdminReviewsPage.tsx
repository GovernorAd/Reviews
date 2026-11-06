import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import {
  Alert,
  App,
  Button,
  Form,
  Input,
  Modal,
  Rate,
  Space,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  type TableColumnsType,
} from 'antd'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import {
  notifyCatalogChanged,
  reviewAdminApi,
  useAdminReviews,
  type Review,
  type ReviewStatus,
  type ReviewStatusFilter,
  type UpdateReviewPayload,
} from '@/entities/review'
import { formatDateTime } from '@/shared/lib'
import { Container, Page } from '@/shared/ui'

const { Paragraph, Text, Title } = Typography

const HeadingRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
  }
`

const AdminTag = styled(Tag)`
  margin-bottom: ${({ theme }) => theme.spacing(2)};
  font-weight: 600;
`

const Subtitle = styled(Paragraph)`
  max-width: 720px;
  margin: ${({ theme }) => `${theme.spacing(2)} 0 0 !important`};
  color: ${({ theme }) => theme.colors.textMuted};
`

const TableCard = styled.section`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};

  .ant-table-wrapper {
    padding: 0 ${({ theme }) => theme.spacing(3)} ${({ theme }) => theme.spacing(3)};
  }

  .ant-tabs-nav {
    padding: 0 ${({ theme }) => theme.spacing(3)};
    margin-bottom: 0 !important;
  }
`

const CarCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 180px;
`

const CarLink = styled(Link)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`

const StatusCell = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(1)};
  align-items: flex-start;
`

const ReasonHint = styled.span`
  max-width: 180px;
  overflow: hidden;
  font-size: 11px;
  color: ${({ theme }) => theme.colors.textMuted};
  text-overflow: ellipsis;
  white-space: nowrap;
`

const ToolbarAlert = styled(Alert)`
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`

const STATUS_META: Record<ReviewStatus, { label: string; color: string }> = {
  pending: { label: 'На модерации', color: 'gold' },
  approved: { label: 'Одобрен', color: 'green' },
  rejected: { label: 'Отклонён', color: 'red' },
}

const PAGE_SIZE = 10

export const AdminReviewsPage = () => {
  const { message } = App.useApp()
  const [status, setStatus] = useState<ReviewStatusFilter>('all')
  const [page, setPage] = useState(1)

  const { reviews, pagination, counts, isLoading, error, refresh } = useAdminReviews({
    status,
    page,
    limit: PAGE_SIZE,
  })

  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [rejectingReview, setRejectingReview] = useState<Review | null>(null)
  const [approvingId, setApprovingId] = useState<string | null>(null)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)

  const [editForm] = Form.useForm<UpdateReviewPayload>()
  const [rejectForm] = Form.useForm<{ reason: string }>()

  useEffect(() => {
    if (!pagination) {
      return
    }

    if (pagination.totalPages === 0 && page !== 1) {
      setPage(1)
      return
    }

    if (pagination.totalPages > 0 && page > pagination.totalPages) {
      setPage(pagination.totalPages)
    }
  }, [pagination, page])

  const handleStatusChange = (nextStatus: string) => {
    setStatus(nextStatus as ReviewStatusFilter)
    setPage(1)
  }

  const handleApprove = async (review: Review) => {
    setApprovingId(review.id)

    try {
      await reviewAdminApi.moderate(review.id, { status: 'approved' })
      notifyCatalogChanged()
      message.success(`Отзыв о ${review.carBrand} ${review.carVersion} одобрен`)
      await refresh()
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось одобрить отзыв')
    } finally {
      setApprovingId(null)
    }
  }

  const handleReject = async (values: { reason: string }) => {
    if (!rejectingReview) {
      return
    }

    setIsRejecting(true)

    try {
      await reviewAdminApi.moderate(rejectingReview.id, {
        status: 'rejected',
        reason: values.reason.trim(),
      })
      notifyCatalogChanged()
      message.success(
        rejectingReview.userId
          ? 'Отзыв отклонён, автор получил уведомление'
          : 'Отзыв отклонён',
      )
      setRejectingReview(null)
      rejectForm.resetFields()
      await refresh()
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось отклонить отзыв')
    } finally {
      setIsRejecting(false)
    }
  }

  const handleEdit = async (values: UpdateReviewPayload) => {
    if (!editingReview) {
      return
    }

    setIsSavingEdit(true)

    try {
      await reviewAdminApi.update(editingReview.id, {
        carBrand: values.carBrand.trim(),
        carVersion: values.carVersion.trim(),
        imageUrl: values.imageUrl?.trim() || undefined,
        rating: values.rating,
        text: values.text.trim(),
      })
      notifyCatalogChanged()
      message.success('Отзыв обновлён')
      setEditingReview(null)
      await refresh()
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось обновить отзыв')
    } finally {
      setIsSavingEdit(false)
    }
  }

  const totalCount = counts
    ? counts.pending + counts.approved + counts.rejected
    : null

  const columns: TableColumnsType<Review> = [
    {
      title: 'Автомобиль',
      key: 'car',
      width: 240,
      render: (_, review) => (
        <CarCell>
          <CarLink to={`/reviews/${review.id}`}>
            {review.carBrand} {review.carVersion}
          </CarLink>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {review.rating.toFixed(1)} ★ · #{review.id.slice(0, 8)}
          </Text>
        </CarCell>
      ),
    },
    {
      title: 'Автор',
      dataIndex: 'author',
      key: 'author',
      width: 160,
      render: (author: string) => <Text strong>{author}</Text>,
    },
    {
      title: 'Статус',
      key: 'status',
      width: 180,
      render: (_, review) => {
        const meta = STATUS_META[review.status]

        return (
          <StatusCell>
            <Tag color={meta.color}>{meta.label}</Tag>
            {review.status === 'rejected' && review.moderationReason ? (
              <Tooltip title={review.moderationReason}>
                <ReasonHint>Причина: {review.moderationReason}</ReasonHint>
              </Tooltip>
            ) : null}
          </StatusCell>
        )
      },
    },
    {
      title: 'Дата',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (createdAt: string) => <Text type="secondary">{formatDateTime(createdAt)}</Text>,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 330,
      render: (_, review) => (
        <Space size={4} wrap>
          {review.status !== 'approved' ? (
            <Button
              size="small"
              type="primary"
              ghost
              icon={<CheckOutlined />}
              loading={approvingId === review.id}
              onClick={() => void handleApprove(review)}
            >
              Одобрить
            </Button>
          ) : null}

          {review.status !== 'rejected' ? (
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                rejectForm.resetFields()
                setRejectingReview(review)
              }}
            >
              Отклонить
            </Button>
          ) : null}

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => setEditingReview(review)}
          >
            Редактировать
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <Page>
      <Container>
        <HeadingRow>
          <div>
            <AdminTag color="purple">
              <SafetyCertificateOutlined /> Админ-панель
            </AdminTag>
            <Title level={1} style={{ margin: 0 }}>
              Модерация отзывов
            </Title>
            <Subtitle>
              Проверяйте новые отзывы, редактируйте содержимое и управляйте публикацией.
              При отклонении автор получит уведомление с указанной причиной.
            </Subtitle>
          </div>

          <Button icon={<ReloadOutlined />} onClick={() => void refresh()} loading={isLoading}>
            Обновить
          </Button>
        </HeadingRow>

        {counts && counts.pending > 0 ? (
          <ToolbarAlert
            type="warning"
            showIcon
            message={`${counts.pending} ${
              counts.pending === 1 ? 'отзыв ожидает' : 'отзывов ожидают'
            } модерации`}
            action={
              <Button size="small" onClick={() => handleStatusChange('pending')}>
                Показать
              </Button>
            }
          />
        ) : null}

        {error ? (
          <Alert
            type="error"
            showIcon
            message="Не удалось загрузить отзывы"
            description={error}
            action={
              <Button size="small" onClick={() => void refresh()}>
                Повторить
              </Button>
            }
            style={{ marginBottom: 16 }}
          />
        ) : null}

        <TableCard>
          <Tabs
            activeKey={status}
            onChange={handleStatusChange}
            items={[
              {
                key: 'all',
                label: `Все${totalCount === null ? '' : ` (${totalCount})`}`,
              },
              {
                key: 'pending',
                label: `На модерации${counts ? ` (${counts.pending})` : ''}`,
              },
              {
                key: 'approved',
                label: `Одобренные${counts ? ` (${counts.approved})` : ''}`,
              },
              {
                key: 'rejected',
                label: `Отклонённые${counts ? ` (${counts.rejected})` : ''}`,
              },
            ]}
          />

          <Table<Review>
            rowKey="id"
            columns={columns}
            dataSource={reviews}
            loading={isLoading}
            size="middle"
            scroll={{ x: 1040 }}
            locale={{ emptyText: 'Отзывов с этим статусом нет' }}
            pagination={{
              current: pagination?.page ?? 1,
              pageSize: pagination?.limit ?? PAGE_SIZE,
              total: pagination?.total ?? 0,
              showSizeChanger: false,
              showTotal: (total) => `Всего: ${total}`,
              onChange: setPage,
            }}
          />
        </TableCard>

        <Modal
          title={
            editingReview
              ? `Редактировать: ${editingReview.carBrand} ${editingReview.carVersion}`
              : 'Редактировать отзыв'
          }
          open={Boolean(editingReview)}
          width={640}
          okText="Сохранить"
          cancelText="Отмена"
          confirmLoading={isSavingEdit}
          onOk={() => editForm.submit()}
          onCancel={() => {
            if (!isSavingEdit) {
              setEditingReview(null)
            }
          }}
          destroyOnHidden
        >
          {editingReview ? (
            <Form<UpdateReviewPayload>
              key={editingReview.id}
              form={editForm}
              layout="vertical"
              requiredMark={false}
              preserve={false}
              initialValues={{
                carBrand: editingReview.carBrand,
                carVersion: editingReview.carVersion,
                imageUrl: editingReview.imageUrl ?? '',
                rating: editingReview.rating,
                text: editingReview.text,
              }}
              onFinish={handleEdit}
            >
              <Form.Item
                name="carBrand"
                label="Марка"
                rules={[
                  { required: true, whitespace: true, message: 'Укажите марку' },
                  { min: 2, message: 'Минимум 2 символа' },
                  { max: 40, message: 'Максимум 40 символов' },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                name="carVersion"
                label="Версия или модель"
                rules={[
                  { required: true, whitespace: true, message: 'Укажите версию' },
                  { max: 60, message: 'Максимум 60 символов' },
                ]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                name="imageUrl"
                label="Ссылка на фото"
                rules={[
                  { type: 'url', message: 'Укажите корректный URL изображения' },
                  { max: 500, message: 'Максимум 500 символов' },
                ]}
              >
                <Input size="large" placeholder="https://example.com/car.jpg" />
              </Form.Item>

              <Form.Item
                name="rating"
                label="Оценка"
                rules={[{ required: true, message: 'Поставьте оценку' }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="text"
                label="Текст отзыва"
                rules={[
                  { required: true, whitespace: true, message: 'Введите текст отзыва' },
                  { min: 20, message: 'Минимум 20 символов' },
                  { max: 3000, message: 'Максимум 3000 символов' },
                ]}
              >
                <Input.TextArea rows={7} maxLength={3000} showCount />
              </Form.Item>
            </Form>
          ) : null}
        </Modal>

        <Modal
          title={
            rejectingReview
              ? `Отклонить: ${rejectingReview.carBrand} ${rejectingReview.carVersion}`
              : 'Отклонить отзыв'
          }
          open={Boolean(rejectingReview)}
          width={520}
          okText="Отклонить"
          cancelText="Отмена"
          okButtonProps={{ danger: true }}
          confirmLoading={isRejecting}
          onOk={() => rejectForm.submit()}
          onCancel={() => {
            if (!isRejecting) {
              setRejectingReview(null)
            }
          }}
          destroyOnHidden
        >
          <Paragraph type="secondary">
            Автор получит уведомление с причиной отклонения. Отзыв не будет показываться
            в общем списке.
          </Paragraph>

          <Form<{ reason: string }>
            form={rejectForm}
            layout="vertical"
            requiredMark={false}
            preserve={false}
            onFinish={handleReject}
          >
            <Form.Item
              name="reason"
              label="Причина отклонения"
              rules={[
                { required: true, whitespace: true, message: 'Укажите причину отклонения' },
                { min: 5, message: 'Минимум 5 символов' },
                { max: 500, message: 'Максимум 500 символов' },
              ]}
            >
              <Input.TextArea
                rows={5}
                maxLength={500}
                showCount
                placeholder="Например: отзыв не относится к заявленному автомобилю"
              />
            </Form.Item>
          </Form>
        </Modal>
      </Container>
    </Page>
  )
}
