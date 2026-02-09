import { siteConfig } from '@/lib/config'
import { isHttpLink } from '@/lib/utils'
import SmartLink from '@/components/SmartLink'
import { useRouter } from 'next/router'
import { memo, useMemo } from 'react'
import NotionIcon from './NotionIcon'

/**
 * 博客卡牌
 * @param {*} param0
 * @returns
 */
const BlogPostCard = memo(({ post, className }) => {
  const router = useRouter()

  // 使用useMemo缓存计算结果
  const currentSelected = useMemo(() => {
    return router.asPath.split('?')[0] === '/' + post.slug
  }, [router.asPath, post.slug])

  const pageIcon = useMemo(() => {
    const icon = post.pageIcon && post.pageIcon !== ''
      ? post.pageIcon
      : siteConfig('IMG_LAZY_LOAD_PLACEHOLDER')
    return icon && icon.indexOf && icon.indexOf('amazonaws.com') !== -1
      ? icon + '&width=88'
      : icon
  }, [post.pageIcon])

  const showIcon = useMemo(() => siteConfig('POST_TITLE_ICON'), [])
  const linkTarget = useMemo(() => isHttpLink(post.slug) ? '_blank' : '_self', [post.slug])

  return (
    <SmartLink
      href={post?.href}
      target={linkTarget}
      passHref>
      <div
        key={post.id}
        className={`${className} h-full rounded-2xl p-4 dark:bg-neutral-800 cursor-pointer bg-white hover:bg-white dark:hover:bg-gray-800 ${currentSelected ? 'bg-green-50 text-green-500' : ''}`}>
        <div className='stack-entry w-full flex space-x-3 select-none dark:text-neutral-200'>
          {showIcon && (
            <NotionIcon
              icon={pageIcon}
              size='10'
              className='text-6xl w-11 h-11 mx-1 my-0 flex-none'
            />
          )}
          <div className='stack-comment flex-auto'>
            <p className='title font-bold'>{post.title}</p>
            <p className='description font-normal'>
              {post.summary ? post.summary : '暂无简介'}
            </p>
          </div>
        </div>
      </div>
    </SmartLink>
  )
})

BlogPostCard.displayName = 'BlogPostCard'

export default BlogPostCard
