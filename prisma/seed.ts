// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Engineers
  await prisma.engineer.createMany({
    data: [
      {
        name: "Б. Батжаргал",
        email: "bat@mine.mn",
        passwordHash: await bcrypt.hash("password123", 10),
      },
      {
        name: "Э. Оюунбаяр",
        email: "oyun@mine.mn",
        passwordHash: await bcrypt.hash("password456", 10),
      },
    ],
    skipDuplicates: true,
  });
  console.log("✓ Engineers seeded");

  // Departments + Questions
  const departments = [
    {
      name: "1001",
      questions: [
        {
          title: "1001-BN-001",
          type: "TEXT",
          order: 1,
          label: "Хүдэр дамжуулах бункерийн  түвшин, %",
        },
        {
          title: "1001-BN-002",
          type: "TEXT",
          order: 2,
          label: "Хүдэр дамжуулах бункерийн  түвшин, %",
        },
        {
          title: "1001-FE-001",
          type: "TEXT",
          order: 3,
          label: "Хавтан тэжээгчийн хурд, Hz",
        },
        {
          title: "1001-FE-002",
          type: "TEXT",
          order: 4,
          label: "Хавтан тэжээгчийн хурд, Hz",
        },
        {
          title: "1001-CR-001",
          type: "TEXT",
          order: 5,
          label: "Бутлуурын гүйдэл, А",
        },
        {
          title: "1001-CR-002",
          type: "TEXT",
          order: 6,
          label: "Бутлуурын гүйдэл, А",
        },
        {
          title: "1001-CV-001",
          type: "TEXT",
          order: 7,
          label: "Конвейерийн гүйдэл, А",
        },
        {
          title: "1001-CV-002",
          type: "TEXT",
          order: 8,
          label: "Конвейерийн гүйдэл, А",
        },
        {
          title: "1001-BN-003",
          type: "TEXT",
          order: 9,
          label: "Бутлагдсан хүдрийн бункерийн түвшин, %",
        },
        {
          title: "1001-FE-003",
          type: "TEXT",
          order: 10,
          label: "Хавтан тэжээгчийн хурд%",
        },
        {
          title: "1001-FE-004",
          type: "TEXT",
          order: 11,
          label: "Хавтан тэжээгчийн хурд%",
        },
        {
          title: "1001-CV-003",
          type: "TEXT",
          order: 12,
          label: "Конвейерийн гүйдэл, А",
        },
        {
          title: "Хүдрийн овоолго хийсэн эсэх",
          type: "BOOLEAN",
          order: 13,
          label: null,
        },
        {
          title: "Нэмэлт мэдээлэл",
          type: "TEXT",
          order: 14,
          label: null,
        },
      ],
    },
    {
      name: "1002",
      questions: [
        // Every hour
        {
          title: "Үзүүлэлт",
          type: "TEXT",
          order: 1,
          label: "Жин хэмжигч",
          allowedHours: [],
        },
        {
          title: "Бүтээл, т/цаг",
          type: "TEXT",
          order: 2,
          label: "Жин хэмжигч",
          allowedHours: [],
        },
        {
          title: "Apron Feeder#003-ын хурд, %",
          type: "TEXT",
          order: 3,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "Чадал, Квт",
          type: "TEXT",
          order: 4,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "Гаралтын хатуулаг, %",
          type: "TEXT",
          order: 5,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "Шигшүүрийн доод бүтээгдэхүүний хатуулаг, %",
          type: "TEXT",
          order: 6,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "1002-РР-001 хурд, %",
          type: "TEXT",
          order: 7,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "1002-РР-002 хурд, %",
          type: "TEXT",
          order: 8,
          label: "Хагас өөрөө нунтаглах тээрэм",
          allowedHours: [],
        },
        {
          title: "Гүйдэл, А",
          type: "TEXT",
          order: 9,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [],
        },
        {
          title: "Чадал, кВт",
          type: "TEXT",
          order: 10,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [],
        },
        {
          title: "Гаралтын хатуулаг, % (БТ)",
          type: "TEXT",
          order: 11,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [],
        },

        // Only odd hours: 9,11,13,15,17,19,21,23,1,3,5
        {
          title: "Гидроциклоны дээд бүтээгдэхүүний урсгал хэмжигчийн заалт",
          type: "TEXT",
          order: 12,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [9, 11, 13, 15, 17, 19, 21, 23, 1, 3, 5],
        },

        // Every hour
        {
          title: "1002-РР-003 хурд, %",
          type: "TEXT",
          order: 13,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [],
        },
        {
          title: "1002-РР-004 хурд, %",
          type: "TEXT",
          order: 14,
          label: "Бөөрөнцөгт тээрэм",
          allowedHours: [],
        },
        {
          title: "Дээд бүтээгдэхүүний хатуулаг, %",
          type: "TEXT",
          order: 15,
          label: "Гидроциклон",
          allowedHours: [],
        },
        {
          title: "Доод бүтээгдэхүүний хатуулаг, %",
          type: "TEXT",
          order: 16,
          label: "Гидроциклон",
          allowedHours: [],
        },

        // Only odd hours: 7,9,11,13,15,17,19,21,23,1,3,5
        {
          title: "Дээд бүтээгдэхүүний хатуулаг 75 микрон, %",
          type: "TEXT",
          order: 17,
          label: "Гидроциклон",
          allowedHours: [7, 9, 11, 13, 15, 17, 19, 21, 23, 1, 3, 5],
        },

        // Every even hour: 6,8,10,12,14,16,18,20,22,0,2,4
        {
          title: "Гидроциклон-1",
          type: "TEXT",
          order: 18,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-2",
          type: "TEXT",
          order: 19,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-3",
          type: "TEXT",
          order: 20,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-4",
          type: "TEXT",
          order: 21,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-5",
          type: "TEXT",
          order: 22,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-6",
          type: "TEXT",
          order: 23,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "Гидроциклон-7",
          type: "TEXT",
          order: 24,
          label: "Гидроциклон",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },

        // Every hour
        {
          title: "Даралт",
          type: "TEXT",
          order: 25,
          label: "Гидроциклон",
          allowedHours: [],
        },

        // Every even hour: 6,8,10,12,14,16,18,20,22,0,2,4
        {
          title: "3001-ТК-001 ус, %",
          type: "TEXT",
          order: 26,
          label: "Усны танкууд",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "3001-ТК-002 ус, %",
          type: "TEXT",
          order: 27,
          label: "Усны танкууд",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "3002-ТК-001 ус, %",
          type: "TEXT",
          order: 28,
          label: "Усны танкууд",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
        {
          title: "3003-ТК-001 ус, %",
          type: "TEXT",
          order: 29,
          label: "Усны танкууд",
          allowedHours: [6, 8, 10, 12, 14, 16, 18, 20, 22, 0, 2, 4],
        },
      ],
    },
    {
      name: "1006 1007",
      questions: [
        {
          title: "Тэжээлийн хатуулаг %",
          type: "TEXT",
          order: 1,
          label: null,
        },
        {
          title: "Гаралтын хатуулаг %",
          type: "TEXT",
          order: 2,
          label: null,
        },
        {
          title: "Халианы усны насосны хурд, %",
          type: "TEXT",
          order: 3,
          label: null,
        },
        {
          title: "Гаралтын насосны хурд, %",
          type: "TEXT",
          order: 4,
          label: null,
        },
        {
          title: "PH зоондын заалт",
          type: "TEXT",
          order: 5,
          label: null,
        },
        {
          title: "Bed mass sensor, kPa",
          type: "TEXT",
          order: 6,
          label: null,
        },
        {
          title: "Bed level sensor, м",
          type: "TEXT",
          order: 7,
          label: null,
        },
        {
          title: "Мушгилтын момент, mPa",
          type: "TEXT",
          order: 8,
          label: null,
        },
        {
          title: "Флокулянтын процент, %",
          type: "TEXT",
          order: 9,
          label: null,
        },
        {
          title: "Флокулянтын дозын насосын хурд, %",
          type: "TEXT",
          order: 10,
          label: null,
        },
        {
          title: "Шохойн урсгал, м3/цаг",
          type: "TEXT",
          order: 11,
          label: null,
        },
        {
          title: "Халианы усны FreeCN, ppm",
          type: "TEXT",
          order: 12,
          label: null,
        },
        {
          title: "Халианы усны pH",
          type: "TEXT",
          order: 13,
          label: null,
        },
        {
          title: "Гар PH метрийн заалт",
          type: "TEXT",
          order: 14,
          label: "Уусгалтын танк#1",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 15,
          label: "Уусгалтын танк#1",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 16,
          label: "Уусгалтын танк#1",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 17,
          label: "Уусгалтын танк#1",
        },
        {
          title: "NaCN урсгал, м3/цаг",
          type: "TEXT",
          order: 18,
          label: "Уусгалтын танк#1",
        },
        {
          title: "HCN детекторын заалт",
          type: "TEXT",
          order: 19,
          label: "Уусгалтын танк#1",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 20,
          label: "Уусгалтын танк#2",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 21,
          label: "Уусгалтын танк#2",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 22,
          label: "Уусгалтын танк#2",
        },
        {
          title: "pH",
          type: "TEXT",
          order: 23,
          label: "Уусгалтын танк#3",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 24,
          label: "Уусгалтын танк#3",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 25,
          label: "Уусгалтын танк#3",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 26,
          label: "Уусгалтын танк#3",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 27,
          label: "Уусгалтын танк#4",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 28,
          label: "Уусгалтын танк#4",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 29,
          label: "Уусгалтын танк#4",
        },
        {
          title: "Гар PH метрийн заалт",
          type: "TEXT",
          order: 30,
          label: "Уусгалтын танк#4",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 31,
          label: "Шингээлтийн танк#1",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 32,
          label: "Шингээлтийн танк#1",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 33,
          label: "Шингээлтийн танк#1",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 34,
          label: "Шингээлтийн танк#1",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 35,
          label: "Шингээлтийн танк#2",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 36,
          label: "Шингээлтийн танк#2",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 37,
          label: "Шингээлтийн танк#2",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 38,
          label: "Шингээлтийн танк#3",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 39,
          label: "Шингээлтийн танк#3",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 40,
          label: "Шингээлтийн танк#3",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 41,
          label: "Шингээлтийн танк#4",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 42,
          label: "Шингээлтийн танк#4",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 43,
          label: "Шингээлтийн танк#4",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 44,
          label: "Шингээлтийн танк#4",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 45,
          label: "Шингээлтийн танк#5",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 46,
          label: "Шингээлтийн танк#5",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 47,
          label: "Шингээлтийн танк#5",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 48,
          label: "Шингээлтийн танк#6",
        },
        {
          title: "Нүүрсний хэмжээ, гр/л",
          type: "TEXT",
          order: 49,
          label: "Шингээлтийн танк#6",
        },
        {
          title: "Гар PH метрийн заалт",
          type: "TEXT",
          order: 50,
          label: "Шингээлтийн танк#6-ын гаралт",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 51,
          label: "Шингээлтийн танк#6-ын гаралт",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 52,
          label: "Шингээлтийн танк#6-ын гаралт",
        },
        {
          title: "Шингээлтийн танк 1-ээс хүчлээр угаах баганаруу",
          type: "TEXT",
          order: 53,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шингээлтийн танк 2-оос шингээх танк 1-рүү",
          type: "TEXT",
          order: 54,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шингээлтийн танк 3-аас шингээх танк 2-руу",
          type: "TEXT",
          order: 55,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шингээлтийн танк 4-өөс шингээх танк 3-руу",
          type: "TEXT",
          order: 56,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шингээлтийн танк 5-аас шингээх танк 4-рүү",
          type: "TEXT",
          order: 57,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шингээлтийн танк 6-аас шингээх танк 5-руу",
          type: "TEXT",
          order: 58,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Нүүрс сэргээх зуунаас шингээлтийн 6-р танкруу",
          type: "TEXT",
          order: 59,
          label: "Нүүрс дамжуулсан эсэх",
        },
        {
          title: "Шинэ нүүрсний танкнаас шингээлтийн 6-р танкруу",
          type: "TEXT",
          order: 60,
          label: "Нүүрс дамжуулсан эсэх",
        },
      ],
    },
    {
      name: "1008 1009",
      questions: [
        {
          title: "Гаралтын хатуулаг %",
          type: "TEXT",
          order: 1,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Халианы усны насосны хурд, %",
          type: "TEXT",
          order: 2,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Гаралтын насосны хурд, % ",
          type: "TEXT",
          order: 3,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "рH зоондын заалт ",
          type: "TEXT",
          order: 4,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Bed mass sensor, kPa",
          type: "TEXT",
          order: 5,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Bed level sensor, м",
          type: "TEXT",
          order: 6,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Мушгилтын момент, МPa",
          type: "TEXT",
          order: 7,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Флокулянтын процент, %",
          type: "TEXT",
          order: 8,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Флокулянтын дозын насосын хурд, л/цаг",
          type: "TEXT",
          order: 9,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Халианы усны FreeCN, ppm",
          type: "TEXT",
          order: 10,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Халианы усны pH",
          type: "TEXT",
          order: 11,
          label: "Өтгөрүүлэгч",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 12,
          label: "Технологийн ус",
        },
        {
          title: "pH",
          type: "TEXT",
          order: 13,
          label: "Технологийн ус",
        },
        {
          title: "pH",
          type: "TEXT",
          order: 14,
          label: "Хоргүйжүүлэхийн тэжээл ",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 15,
          label: "Хоргүйжүүлэхийн тэжээл ",
        },
        {
          title: "Solids, %",
          type: "TEXT",
          order: 16,
          label: "Хоргүйжүүлэхийн тэжээл ",
        },
        {
          title: "Гар рH метрийн заалт",
          type: "TEXT",
          order: 17,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 18,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 19,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "Метабисульфитын урсгал, м3/ц",
          type: "TEXT",
          order: 20,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "Зэсийн сульфатын урсгал, л/ц",
          type: "TEXT",
          order: 21,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 22,
          label: "Хоргүйжүүлэх танк#1-ын гаралт",
        },
        {
          title: "Гар рH метрийн заалт",
          type: "TEXT",
          order: 23,
          label: "Хоргүйжүүлэх танк#2-ын гаралт",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 24,
          label: "Хоргүйжүүлэх танк#2-ын гаралт",
        },
        {
          title: "DO метрийн заалт, мг/л",
          type: "TEXT",
          order: 25,
          label: "Хоргүйжүүлэх танк#2-ын гаралт",
        },
        {
          title: "Хатуулаг, %",
          type: "TEXT",
          order: 26,
          label: "Хоргүйжүүлэх танк#2-ын гаралт",
        },
        {
          title: "Free CN ppm",
          type: "TEXT",
          order: 27,
          label: "Филтер пресс (шүүсэн ус)",
        },
      ],
    },
    {
      name: "1010",
      questions: [
        {
          title: "Шахалтын дугаар",
          type: "NUMBER",
          order: 1,
          label: null,
        },
        {
          title: "Эхэлсэн цаг",
          type: "TEXT",
          order: 2,
          label: null,
        },
        {
          title: "Дууссан цаг",
          type: "TEXT",
          order: 3,
          label: null,
        },
        {
          title: "PP-001",
          type: "TEXT",
          order: 4,
          label: "Зутангийн насос",
        },
        {
          title: "PP-002",
          type: "TEXT",
          order: 5,
          label: "Зутангийн насос",
        },
        {
          title: "FL-001",
          type: "TEXT",
          order: 6,
          label: "Пресс фильтр",
        },
        {
          title: "FL-002",
          type: "TEXT",
          order: 7,
          label: "Пресс фильтр",
        },
        {
          title: "Агаарын даралт, кПа",
          type: "TEXT",
          order: 8,
          label: null,
        },
        {
          title: "Насосны даралт, кПа",
          type: "TEXT",
          order: 9,
          label: null,
        },
        {
          title: "Усны даралт, кПа",
          type: "TEXT",
          order: 10,
          label: null,
        },
      ],
    },
    {
      name: "1011",
      questions: [
        {
          title: "Tank Level(LIT051), %",
          type: "TEXT",
          order: 1,
          label: "ELUATE",
        },
        {
          title: "%Cyanide",
          type: "TEXT",
          order: 2,
          label: "ELUATE",
        },
        {
          title: "%Sodium Hydroxide",
          type: "TEXT",
          order: 3,
          label: "ELUATE",
        },
        {
          title: "Harvest Batch No.",
          type: "TEXT",
          order: 4,
          label: "LOADED CARBON",
        },
        {
          title: "Acid soaking",
          type: "TEXT",
          order: 5,
          label: "LOADED CARBON",
        },
        {
          title: "C Transfer Flowrate to Elution  m3/h",
          type: "TEXT",
          order: 6,
          label: "LOADED CARBON",
        },
        {
          title: "C Transfer Flowrate to Regen. Kiln m3/h",
          type: "TEXT",
          order: 7,
          label: "LOADED CARBON",
        },
        {
          title: "Solution Heater",
          type: "TEXT",
          order: 8,
          label: "ELUTION",
        },
        {
          title: "Eluate Flowrate FIT010, m3/h",
          type: "TEXT",
          order: 9,
          label: "ELUTION",
        },
        {
          title: "Column Pressure PT004, kPa",
          type: "TEXT",
          order: 10,
          label: "ELUTION",
        },
        {
          title: "Heater Feed Temp. TT230, °C",
          type: "TEXT",
          order: 11,
          label: "ELUTION",
        },
        {
          title: "Column Feed Temp. TT017, °C",
          type: "TEXT",
          order: 12,
          label: "ELUTION",
        },
        {
          title: "F3 Inlet Press., kPa  Analog V108",
          type: "TEXT",
          order: 13,
          label: "RECOVERY HEAT EXCHANGER HX-001",
        },
        {
          title: "F2 Outlet Press., kPa  Analog V42",
          type: "TEXT",
          order: 14,
          label: "RECOVERY HEAT EXCHANGER HX-001",
        },
        {
          title: "F1 Inlet Press., kPa  Analog V24",
          type: "TEXT",
          order: 15,
          label: "RECOVERY HEAT EXCHANGER HX-001",
        },
        {
          title: "F4 Outlet Press., kPa  Analog V29",
          type: "TEXT",
          order: 16,
          label: "RECOVERY HEAT EXCHANGER HX-001",
        },
        {
          title: "F1 Inlet Press., kPa  Analog V32",
          type: "TEXT",
          order: 17,
          label: "TRIM HEAT EXCHANGER HX-002",
        },
        {
          title: "F4 Outlet Press., kPa  Analog V35",
          type: "TEXT",
          order: 18,
          label: "TRIM HEAT EXCHANGER HX-002",
        },
        {
          title: "Inlet Press., kPa  Analog V45",
          type: "TEXT",
          order: 19,
          label: "ELUATE HEATER HE-001",
        },
        {
          title: "Outlet Press., kPa Analog V46",
          type: "TEXT",
          order: 20,
          label: "ELUATE HEATER HE-001",
        },
        {
          title: "RC-001 Voltage (V)",
          type: "TEXT",
          order: 21,
          label: "EW RECTIFIERS",
        },
        {
          title: "RC-001 Ampere (A)",
          type: "TEXT",
          order: 22,
          label: "EW RECTIFIERS",
        },
        {
          title: "RC-002 Voltage (V)",
          type: "TEXT",
          order: 23,
          label: "EW RECTIFIERS",
        },
        {
          title: "RC-002 Ampere (A)",
          type: "TEXT",
          order: 24,
          label: "EW RECTIFIERS",
        },
        {
          title: "Pregnant Solution Au, ppm",
          type: "TEXT",
          order: 25,
          label: "EW RECTIFIERS",
        },
        {
          title: "Pregnant Solution Ag, ppm",
          type: "TEXT",
          order: 26,
          label: "EW RECTIFIERS",
        },
        {
          title: "Barren Solution Au, ppm",
          type: "TEXT",
          order: 27,
          label: "EW RECTIFIERS",
        },
        {
          title: "Barren Solution Ag, ppm",
          type: "TEXT",
          order: 28,
          label: "EW RECTIFIERS",
        },
        {
          title: "1011-PS-001 (Acid Column PS)",
          type: "TEXT",
          order: 29,
          label: "SUMP PUMPS",
        },
        {
          title: "1011-PS-002 (Elution Column PS)",
          type: "TEXT",
          order: 30,
          label: "SUMP PUMPS",
        },
        {
          title: "Tank Level",
          type: "TEXT",
          order: 31,
          label: "DIESEL",
        },
        {
          title: "5001-PP-001",
          type: "TEXT",
          order: 32,
          label: "DIESEL",
        },
        {
          title: "5001-PP-002",
          type: "TEXT",
          order: 33,
          label: "DIESEL",
        },
      ],
    },
  ];

  for (const dept of departments) {
    const department = await prisma.department.upsert({
      where: { name: dept.name },
      update: {},
      create: { name: dept.name },
    });

    for (const q of dept.questions) {
      await prisma.question.upsert({
        where: {
          title_departmentId: {
            title: q.title,
            departmentId: department.id,
          },
        },
        update: {},
        create: {
          title: q.title,
          type: q.type as any,
          order: q.order,
          label: q.label,
          departmentId: department.id,
        },
      });
    }

    console.log(
      `✓ ${dept.name} seeded with ${dept.questions.length} questions`,
    );
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
