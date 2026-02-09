/* eslint-disable */
import { siteConfig } from '@/lib/config'
import { useNavGlobal } from '@/themes/nav'
import { useMemo } from 'react'
import CONFIG from '../config'
import BlogPostItem from './BlogPostItem'
import BlogPostListEmpty from './BlogPostListEmpty'

/**
 * 博客列表滚动分页
 * @param posts 所有文章
 * @param tags 所有标签
 * @returns {JSX.Element}
 * @constructor
 */
const BlogPostListAll = (props) => {
  const { customMenu } = props
  const { filteredNavPages, setFilteredNavPages, allNavPages } = useNavGlobal()

  // 使用useMemo缓存filterLinks计算，只在customMenu变化时重新计算
  const filterLinks = useMemo(() => {
    const links = customMenu
    const result = {}
    // 遍历数组构建filterLinks对象
    links?.forEach((link) => {
      const linkTitle = link.title + ''
      result[linkTitle] = { title: link.title, icon: link.icon, pageIcon: link.pageIcon }
      if (link?.subMenus) {
        link.subMenus?.forEach((group) => {
          const subMenuTitle = group?.title + ''
          // 自定义分类图标与post的category共用
          // 判断自定义分类与Post中category同名的项，将icon的值传递给post
          result[subMenuTitle] = { title: group.title, icon: group.icon, pageIcon: group.pageIcon }
        })
      }
    })
    return result
  }, [customMenu])

  // 使用useMemo缓存分组计算，只在filteredNavPages或filterLinks变化时重新计算
  const groupedArray = useMemo(() => {
    const autoSort = JSON.parse(siteConfig('NAV_AUTO_SORT', null, CONFIG))

    const groups = filteredNavPages?.reduce((acc, item) => {
      const categoryName = item?.category || '' // 将category转换为字符串
      const categoryIcon = filterLinks[categoryName]?.icon || '' // 获取分类图标
      let existingGroup = null

      // 开启自动分组排序
      if (autoSort) {
        existingGroup = acc.find(group => group.category === categoryName) // 搜索同名的分组
      } else {
        existingGroup = acc[acc.length - 1] // 获取最后一个分组
      }

      // 添加数据
      if (existingGroup && existingGroup.category === categoryName) {
        existingGroup.items.push(item)
      } else {
        acc.push({ category: categoryName, icon: categoryIcon, items: [item], selected: false })
      }
      return acc
    }, [])

    // 如果都没有选中默认打开第一个
    if (groups && groups.length > 0) {
      groups[0].selected = true
    }

    return groups
  }, [filteredNavPages, filterLinks])

  if (!groupedArray || groupedArray.length === 0) {
    return <BlogPostListEmpty />
  }

  return (
    <div id='posts-wrapper' className='stack-list w-full mx-auto justify-center'>
      {/* 文章列表 */}
      {groupedArray.map((group, index) => (
        <BlogPostItem
          key={index}
          group={group}
          filterLinks={filterLinks}
          onHeightChange={props.onHeightChange}
        />
      ))}
    </div>
  )
}

export default BlogPostListAll
