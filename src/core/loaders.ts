export const loader = {
  html(url: string): Promise<DocumentFragment> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.text();
      })
      .then((t) => document.createRange().createContextualFragment(t));
  },
  json<T extends object>(url: string): Promise<T> {
    return fetch(url)
      .then((response) => {
        if (!response.ok) throw new Error(response.statusText);
        return response.json();
      })
  }
}

