new_data = ''
with open('top-10k-songs-with-artists.txt') as f:
    for line in f:
        s = line.rstrip()
        if s.count(',') > 2: 
            ci = []
            for i in range(len(s)):
                if s[i] == ',':
                    ci.append(i)

            i = 0
            ns = ''
            for c in s:
                if c == ',':
                    if i >= ci[len(ci)-1]:
                        ns += c
                else:
                    ns += c
                i += 1
            s = ns

        if s.endswith(', The'):
            ns = s[:-5]    
            ws = [w.strip() for w in ns.split(',')]
            nws = ws[:len(ws)-1] + [', The '] + ws[len(ws)-1:]
            s = ''.join(nws)
        new_data += s  + '\n'

with open('new-top-10k-songs-with-artists.txt', 'w') as f:
    f.write(new_data)
