import Link from "next/link";
import type { Block, BlogPost } from "@/lib/blogs";

function assertNever(value: never): never {
  throw new Error(`Unsupported article block: ${JSON.stringify(value)}`);
}

function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p>{block.text}</p>;
    case "h2":
      return <h2>{block.text}</h2>;
    case "h3":
      return <h3>{block.text}</h3>;
    case "ul":
      return <ul>{block.items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ul>;
    case "ol":
      return <ol>{block.items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}</ol>;
    case "code":
      return <pre><code>{block.text}</code></pre>;
    case "callout":
      return <div className="article-callout">{block.text}</div>;
    case "tool":
      return (
        <div className="article-cta">
          <strong>Try OpenGraph Preview</strong>
          <p>{block.text}</p>
          <Link href="/#tool">Open the free tool →</Link>
        </div>
      );
    default:
      return assertNever(block);
  }
}

export function ArticleContent({ post }: { post: BlogPost }) {
  return (
    <>
      <div className="article-body">
        {post.blocks.map((block, index) => (
          <RenderBlock key={`${block.type}-${index}`} block={block} />
        ))}
      </div>
      <section style={{ marginTop: 36, paddingTop: 22, borderTop: "1px solid #e5e8ee" }}>
        <h2 style={{ fontSize: 20, letterSpacing: "-.035em" }}>Frequently asked questions</h2>
        {post.faqs.map((faq) => (
          <div key={faq.question} style={{ marginTop: 17 }}>
            <h3 style={{ margin: "0 0 5px", fontSize: 14 }}>{faq.question}</h3>
            <p style={{ margin: 0, color: "#687282", fontSize: 13, lineHeight: 1.7 }}>{faq.answer}</p>
          </div>
        ))}
      </section>
      <section style={{ marginTop: 30, padding: 18, border: "1px solid #e5e8ee", background: "#fff", borderRadius: 12 }}>
        <strong style={{ fontSize: 13 }}>Sources and further reading</strong>
        <ul style={{ margin: "10px 0 0", paddingLeft: 18, color: "#6558e8", fontSize: 12, lineHeight: 1.8 }}>
          {post.sources.map((source) => (
            <li key={source.url}>
              <a href={source.url} target="_blank" rel="noopener noreferrer">{source.label} ↗</a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
