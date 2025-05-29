# Oprește urmărirea submodulului
git rm --cached Yumlogy

# Șterge folderul local
rm -rf Yumlogy

# (Opțional) Șterge din .gitmodules dacă există
rm -f .gitmodules

# Commit pentru curățenie
git commit -am "Removed broken Yumlogy submodule"

# Apoi adaugă-l din nou (dacă vrei)
git submodule add https://github.com/USERNAME/Yumlogy.git Yumlogy
git commit -am "Re-added working Yumlogy submodule"
