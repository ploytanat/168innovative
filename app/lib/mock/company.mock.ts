import { CompanyInfo } from '../types/content'

export const companyMock: CompanyInfo = {
  name: {
    th: '168 Innovative Co., Ltd.',
    en: '168 Innovative Co., Ltd.'
  },
  address: {
    th: '89/269 ซอยเทียนทะเล 20 แขวงแสมดำ เขตบางขุนเทียน กรุงเทพฯ 10150',
    en: '89/269 Soi Thian Thale 20, Samae Dam, Bang Khun Thian, Bangkok 10150'
  },
  phones: [
    {
      number: '098-614-9646',
      label: { th: 'คุณจอย', en: 'Joy' }
    },
    {
      number: '080-465-6669',
      label: { th: 'คุณเบิร์ด', en: 'Bird' }
    }
  ],
  email: ['sales.168innovative@gmail.com']
}
