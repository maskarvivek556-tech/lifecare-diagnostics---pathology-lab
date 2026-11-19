import React, { createContext, useContext, useEffect, useState } from 'react';

interface RouteState {
  path: string;
  query: Record<string, string>;
}

interface RouterContextValue {
  path: string;
  query: Record<string, string>;
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  path: '/',
  query: {},
  navigate: () => {},
});

function parseHashRoute(hash: string): RouteState {
  const cleaned = hash.replace(/^#/, '') || '/';
  const [rawPath, rawSearch] = cleaned.split('?');
  const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
  const query: Record<string, string> = {};
  if (rawSearch) {
    const params = new URLSearchParams(rawSearch);
    params.forEach((value, key) => {
      query[key] = value;
    });
  }
  return { path, query };
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [route, setRoute] = useState<RouteState>(() =>
    parseHashRoute(window.location.hash)
  );

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute(window.location.hash));
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (to: string) => {
    const normalized = to.startsWith('/') ? to : `/${to}`;
    const targetHash = `#${normalized}`;
    if (window.location.hash === targetHash) {
      setRoute(parseHashRoute(targetHash));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = targetHash;
    }
  };

  return (
    <RouterContext.Provider value={{ path: route.path, query: route.query, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
