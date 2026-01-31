"use client"

import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // Import styles for math rendering

export function MarkdownPreview({ content }: { content: string }) {
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
            // Custom styling for specific elements if needed
            p: ({node, ...props}) => <p className="leading-7 [&:not(:first-child)]:mt-6" {...props} />,
            h1: ({node, ...props}) => <h1 className="scroll-m-20 text-2xl font-extrabold tracking-tight lg:text-3xl" {...props} />,
            h2: ({node, ...props}) => <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0" {...props} />,
            ul: ({node, ...props}) => <ul className="my-6 ml-6 list-disc [&>li]:mt-2" {...props} />,
            ol: ({node, ...props}) => <ol className="my-6 ml-6 list-decimal [&>li]:mt-2" {...props} />,
            blockquote: ({node, ...props}) => <blockquote className="mt-6 border-l-2 pl-6 italic" {...props} />,
        }}
      >
        {content || "*No content.*"}
      </ReactMarkdown>
    </div>
  )
}
