import type { FooterModel, NavLink } from "@/types/homepage"

interface FooterColumnProps {
  title: string
  links: NavLink[]
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <h4 className="mb-[15px] text-[13px] font-bold uppercase text-[#333]">
        {title}
      </h4>
      <ul>
        {links.map((link, index) => (
          <li key={`${link.href}-${link.label}-${index}`} className="mb-[8px]">
            <a href={link.href} className="text-[#666]">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

interface FooterProps {
  footer: FooterModel
}

export default function Footer({ footer }: FooterProps) {
  return (
    <footer id="footer" className="border-t border-[#eee] bg-[#f4f4f4] py-[60px] text-[14px]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[2fr_repeat(4,_1fr)] gap-[30px] px-[20px]">
        <div className="col-[1/2]">
          <div className="mb-[20px] text-[24px] font-bold text-[#333]">
            ORGANIC STORE
          </div>
          <h4 className="mb-[15px] text-[13px] font-bold uppercase text-[#333]">
            Stay Updated
          </h4>
          <p className="mb-[15px] text-[#666]">{footer.newsletterDescription}</p>
          <form>
            <input
              type="email"
              placeholder={footer.newsletterPlaceholder}
              className="mr-[10px] w-[70%] rounded-[5px] border border-[#ccc] px-[10px] py-[10px]"
            />
            <button
              type="submit"
              className="inline-block cursor-pointer rounded-[5px] border-none bg-[#333] px-[20px] py-[10px] font-bold text-white"
            >
              Subscribe
            </button>
          </form>
        </div>
        <FooterColumn title="Shop" links={footer.shopLinks} />
        <FooterColumn title="About" links={footer.aboutLinks} />
        <FooterColumn title="Support" links={footer.supportLinks} />
        <FooterColumn title="Journal" links={footer.journalLinks} />
      </div>
      <div className="mx-auto mt-[40px] max-w-[1200px] border-t border-[#eee] px-[20px] pt-[20px] text-center text-[12px] text-[#999]">
        <p>{footer.copyright}</p>
      </div>
    </footer>
  )
}
