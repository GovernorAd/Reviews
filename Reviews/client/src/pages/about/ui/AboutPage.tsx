import { Tag, Typography } from 'antd'
import styled from 'styled-components'

import { Container, Page } from '@/shared/ui'

const { Paragraph, Title } = Typography

const Section = styled.section`
  padding: ${({ theme }) => theme.spacing(6)};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.card};

  & + & {
    margin-top: ${({ theme }) => theme.spacing(4)};
  }
`

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing(2)};
  margin-top: ${({ theme }) => theme.spacing(4)};
`

const Layers = styled.ol`
  margin: ${({ theme }) => theme.spacing(3)} 0 0;
  padding-left: ${({ theme }) => theme.spacing(5)};
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.8;
`

const STACK = [
  'React 19',
  'TypeScript',
  'Vite',
  'Feature-Sliced Design',
  'Ant Design',
  'styled-components',
  'React Router',
  'Express',
  'Zod',
  'JWT',
  'scrypt',
]

export const AboutPage = () => (
  <Page>
    <Container>
      <Title level={1} style={{ marginTop: 0 }}>
        О проекте
      </Title>
      <Paragraph style={{ maxWidth: 640, fontSize: 16 }}>
        Reviews — сайт отзывов об автомобилях. На главной странице — по 10 отзывов с пагинацией,
        фотографией машины, маркой, версией, автором, датой и первыми 50 словами текста. В меню под
        шапкой собраны марки с количеством отзывов, а в выпадающих списках — версии и их счётчики.
        Полный отзыв и комментарии открываются на отдельной странице. Клиент построен по
        Feature-Sliced Design, сервер — слоистый Express API на TypeScript.
      </Paragraph>

      <Section style={{ marginTop: 24 }}>
        <Title level={3} style={{ marginTop: 0 }}>
          Стек
        </Title>
        <Tags>
          {STACK.map((item) => (
            <Tag key={item} color="purple">
              {item}
            </Tag>
          ))}
        </Tags>
      </Section>

      <Section>
        <Title level={3} style={{ marginTop: 0 }}>
          Слои FSD
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0 }}>
          Каждый слой может импортировать только слои ниже. Публичный API слайса — файл
          <code> index.ts</code>.
        </Paragraph>
        <Layers>
          <li>
            <strong>app</strong> — провайдеры, роутинг, глобальные стили, layout.
          </li>
          <li>
            <strong>pages</strong> — список отзывов, полный отзыв, вход, регистрация, информация и
            404.
          </li>
          <li>
            <strong>widgets</strong> — шапка приложения, меню марок и версий, список превью отзывов
            и карточка авторизации.
          </li>
          <li>
            <strong>features</strong> — вход, регистрация, выход, создание отзыва и комментария,
            фильтрация.
          </li>
          <li>
            <strong>entities</strong> — модели, API и UI отзыва и пользователя.
          </li>
          <li>
            <strong>shared</strong> — UI-примитивы, тема, HTTP-клиент и утилиты.
          </li>
        </Layers>
      </Section>

      <Section>
        <Title level={3} style={{ marginTop: 0 }}>
          Модерация
        </Title>
        <Paragraph>
          Новый отзыв сначала попадает на модерацию и не отображается в общем списке, каталоге и
          меню марок. Администратор открывает панель <code>/admin/reviews</code>, где можно
          фильтровать отзывы по статусу, одобрять их, отклонять с обязательной причиной и
          редактировать содержимое. В публичном списке остаются только одобренные отзывы, а
          комментарии доступны только к ним.
        </Paragraph>
        <Paragraph style={{ marginBottom: 0 }}>
          При изменении статуса автор получает уведомление. В уведомлении об отклонении указана
          причина, а колокольчик в шапке показывает количество непрочитанных сообщений и ведёт к
          нужному отзыву.
        </Paragraph>
      </Section>

      <Section>
        <Title level={3} style={{ marginTop: 0 }}>
          Аутентификация
        </Title>
        <Paragraph style={{ marginBottom: 0 }}>
          Регистрация и вход доступны на страницах <code>/register</code> и <code>/login</code>.
          Пароль хранится в виде scrypt-хэша, а сессия — в JWT внутри httpOnly cookie. Создавать
          отзывы и комментарии могут только авторизованные пользователи; удалять отзыв может только
          его автор. У администратора есть роль <code>admin</code>, которая открывает доступ к
          модерации.
        </Paragraph>
      </Section>

      <Section>
        <Title level={3} style={{ marginTop: 0 }}>
          API
        </Title>
        <Paragraph style={{ marginBottom: 0 }}>
          <code>POST /api/auth/register</code>, <code>POST /api/auth/login</code>,{' '}
          <code>GET /api/auth/me</code> — аутентификация. <code>GET /api/reviews</code> — страница
          одобренных отзывов с фильтрами по марке и версии,{' '}
          <code>GET /api/reviews/catalog</code> — марки и версии со счётчиками,{' '}
          <code>GET /api/reviews/:id</code> — полный отзыв, <code>POST /api/reviews</code> —
          создание отзыва на модерацию, <code>DELETE /api/reviews/:id</code> — удаление,{' '}
          <code>POST /api/reviews/:id/comments</code> — комментарий. Админ-панель использует{' '}
          <code>/api/admin/reviews</code> и <code>/api/admin/reviews/:id/status</code>, а
          уведомления — <code>/api/notifications</code>. Сервер запускается на порту 4000, Vite
          проксирует <code>/api</code>.
        </Paragraph>
      </Section>
    </Container>
  </Page>
)
