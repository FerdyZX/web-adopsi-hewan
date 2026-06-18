# Contributing to Adopsi Hewan Modern

## Welcome! 👋

Terima kasih telah tertarik untuk berkontribusi pada proyek Adopsi Hewan Modern!

## Cara Berkontribusi

### 1. Fork Repository
```bash
git clone https://github.com/your-username/adopsi-hewan.git
cd adopsi-hewan
```

### 2. Buat Branch Baru
```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b bugfix/nama-bug
```

### 3. Commit Changes
```bash
git add .
git commit -m "feat: deskripsi fitur" # Gunakan conventional commits
```

### 4. Push ke GitHub
```bash
git push origin feature/nama-fitur
```

### 5. Buat Pull Request
- Jelaskan perubahan yang dibuat
- Reference issue jika ada
- Pastikan semua tests pass

## Conventional Commits

Format commit message:
```
feat:     Add new feature
fix:      Fix a bug
docs:     Documentation changes
style:    Code style changes (formatting)
refactor: Refactor code
test:     Add/modify tests
chore:    Maintenance tasks
```

Contoh:
```
feat: add animal filter by category
fix: fix dark mode toggle animation
docs: update README with setup guide
```

## Code Style

### Frontend (React/JavaScript)
```javascript
// Use functional components
const MyComponent = () => {
  return <div>Hello</div>
}

// Use meaningful variable names
const [isLoading, setIsLoading] = useState(false)

// Add comments untuk logic kompleks
// Calculate distance between two coordinates
const distance = getDistance(lat1, lon1, lat2, lon2)
```

### Backend (Express/Node)
```javascript
// Use descriptive function names
export const getUserAdoptionHistory = async (req, res) => {
  // Implementation
}

// Add error handling
try {
  const result = await someOperation()
} catch (error) {
  res.status(500).json({ message: error.message })
}
```

## Testing

```bash
# Frontend
cd frontend
npm test

# Backend
cd backend
npm test
```

## Reporting Issues

Saat membuat issue, sertakan:
1. Deskripsi jelas tentang bug/feature
2. Steps untuk reproduce
3. Expected behavior
4. Actual behavior
5. Screenshots jika relevant

Template:
```
## Deskripsi
[Jelaskan issue]

## Steps Reproduce
1. ...
2. ...
3. ...

## Expected
[Apa yang seharusnya terjadi]

## Actual
[Apa yang terjadi sebenarnya]

## Environment
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox
- Node version: 18.x
```

## Development Setup

```bash
# Setup environment
./setup.sh # atau setup.bat untuk Windows

# Start development
npm run dev # di masing-masing folder
```

## Review Process

1. Minimal 1 review approval
2. Semua tests harus pass
3. No merge conflicts
4. Code quality OK

## Communication

- 💬 GitHub Discussions untuk pertanyaan
- 🐛 GitHub Issues untuk bugs
- 📧 Email: dev@adopsihewan.com
- 🎯 Discord Community: [link]

## Code of Conduct

Kami berkomitmen untuk menciptakan lingkungan yang ramah dan inklusif.

- Treat semua orang dengan respect
- Tidak ada harassment atau discrimination
- Bersikap professional
- Terbuka terhadap feedback

## Lisensi

Dengan berkontribusi, Anda menyetujui bahwa kontribusi Anda di bawah MIT License.

---

**Terima kasih atas kontribusi Anda! 🙌**
