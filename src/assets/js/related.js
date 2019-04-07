class Related {
  constructor() {
    this.manager = null;
    this.directs = [];
    this.show = false;
  }

  async update(username) {
    try {
      const res = await fetch(`/api/v4/orgchart/related/${username}`);
      const { manager, directs } = await res.json();
      this.manager = manager || null;
      this.directs = directs || [];
    } catch (e) {
      this.manger = null;
      this.directs = [];
    }
    this.show = this.manager != null || this.directs.length > 0;
  }
}

export default Related;