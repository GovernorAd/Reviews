import { PlusOutlined } from '@ant-design/icons'
import { App, Button, Form, Input, Modal, Rate, Typography } from 'antd'
import { useState } from 'react'

import { reviewApi, type CreateReviewPayload, type Review } from '@/entities/review'
import { useAuth } from '@/entities/user'

const { Text } = Typography

interface CreateReviewButtonProps {
  onCreated: (review: Review) => void | Promise<void>
}

export const CreateReviewButton = ({ onCreated }: CreateReviewButtonProps) => {
  const { user } = useAuth()
  const { message } = App.useApp()
  const [form] = Form.useForm<CreateReviewPayload>()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (values: CreateReviewPayload) => {
    setIsSubmitting(true)

    try {
      const created = await reviewApi.create({
        carBrand: values.carBrand.trim(),
        carVersion: values.carVersion.trim(),
        imageUrl: values.imageUrl?.trim() || undefined,
        rating: values.rating,
        text: values.text.trim(),
      })

      message.success('Отзыв отправлен на модерацию')
      form.resetFields()
      setIsOpen(false)
      await onCreated(created)
    } catch (cause) {
      message.error(cause instanceof Error ? cause.message : 'Не удалось отправить отзыв')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => setIsOpen(true)}>
        Написать отзыв
      </Button>

      <Modal
        title="Новый отзыв об автомобиле"
        open={isOpen}
        width={600}
        okText="Отправить"
        cancelText="Отмена"
        confirmLoading={isSubmitting}
        onOk={() => form.submit()}
        onCancel={() => {
          if (!isSubmitting) {
            setIsOpen(false)
          }
        }}
        destroyOnHidden
      >
        {user ? (
          <Text type="secondary">
            Отзыв будет отправлен на модерацию от имени <Text strong>{user.username}</Text>.
            После проверки администратором он появится в общем списке.
          </Text>
        ) : null}

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ rating: 5 }}
          preserve={false}
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          <Form.Item
            name="carBrand"
            label="Марка"
            rules={[
              { required: true, whitespace: true, message: 'Укажите марку автомобиля' },
              { min: 2, message: 'Минимум 2 символа' },
              { max: 40, message: 'Максимум 40 символов' },
            ]}
          >
            <Input size="large" placeholder="Например, BMW" />
          </Form.Item>

          <Form.Item
            name="carVersion"
            label="Версия или модель"
            rules={[
              { required: true, whitespace: true, message: 'Укажите версию или модель' },
              { max: 60, message: 'Максимум 60 символов' },
            ]}
            extra="Например, M3 Competition или Camry 3.5. Версия появится в меню марок."
          >
            <Input size="large" placeholder="Например, M3 Competition" />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Ссылка на фото автомобиля"
            rules={[
              { type: 'url', message: 'Укажите корректный URL изображения' },
              { max: 500, message: 'Максимум 500 символов' },
            ]}
            extra="Необязательно. Без ссылки покажем изображение-заглушку."
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
            label="Отзыв"
            rules={[
              { required: true, whitespace: true, message: 'Напишите отзыв' },
              { min: 20, message: 'Минимум 20 символов' },
              { max: 3000, message: 'Максимум 3000 символов' },
            ]}
            extra="Расскажите об опыте эксплуатации: плюсы, минусы и особенности"
          >
            <Input.TextArea
              rows={6}
              maxLength={3000}
              showCount
              placeholder="Поделитесь впечатлениями об автомобиле"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}
